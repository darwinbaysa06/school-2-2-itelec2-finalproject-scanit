import { SQLiteDatabase } from "expo-sqlite";
import { MutableRefObject } from "react";
import { Linking, Platform } from "react-native";

import {
  addHistoryEntry,
  createHistoryId,
  getNextHistoryQrName,
} from "../../db/database";
import { showAppAlert } from "./appAlert";

export async function handleQRScanned(
  data: string,
  db: SQLiteDatabase,
  scanLockRef: MutableRefObject<boolean>,
  setQrScannerData: (data: string) => void,
  setQrScanModalVisible: (visible: boolean) => void,
  autoOpenQr: boolean = false,
) {
  if (scanLockRef.current) {
    return;
  }
  scanLockRef.current = true;
  setQrScannerData(data);
  try {
    const qrname = await getNextHistoryQrName(db);

    await addHistoryEntry(db, {
      id: createHistoryId(),
      qrname,
      qrcontent: data,
    });

    if (autoOpenQr) {
      scanLockRef.current = false;
      qrContentOpenHandler(data);
    } else {
      setQrScanModalVisible(true);
    }
  } catch (error) {
    scanLockRef.current = false;
    throw error;
  }
}

function openSystemLink(url: string) {
  if (Platform.OS === "web") {
    window.location.href = url;
    return;
  }

  Linking.openURL(url).catch(() => {
    showAppAlert(
      "QR Content",
      "Unable to open this QR content on your device.",
    );
  });
}

export function qrContentOpenHandler(content: string) {
  if (
    content.startsWith("http://") ||
    content.startsWith("https://") ||
    content.startsWith("mailto:") ||
    content.startsWith("tel:")
  ) {
    openSystemLink(content);
  } else if (content.startsWith("WIFI:")) {
    showAppAlert("Wi-Fi QR Code", qrTextParser(content));
  } else if (content.startsWith("BEGIN:VCARD")) {
    showAppAlert("Contact QR Code", qrTextParser(content));
  } else {
    showAppAlert("QR Content", content);
  }
}

function qrTextParser(content: string) {
  if (
    content.startsWith("mailto:") ||
    content.startsWith("tel:") ||
    content.startsWith("http://") ||
    content.startsWith("https://")
  ) {
    return content;
  } else if (content.startsWith("WIFI:")) {
    const wifiInfo = content.substring(5).split(";");
    const ssid =
      wifiInfo.find((item) => item.startsWith("S:"))?.substring(2) ||
      "Unknown SSID";
    const password =
      wifiInfo.find((item) => item.startsWith("P:"))?.substring(2) ||
      "No password";
    return `Wi-Fi Network\nSSID: ${ssid}\nPassword: ${password}`;
  } else if (content.startsWith("BEGIN:VCARD")) {
    // parse vCard into key -> array of values
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const fields: Record<string, string[]> = {};
    for (const line of lines) {
      // skip BEGIN/END
      if (/^BEGIN:/i.test(line) || /^END:/i.test(line)) continue;
      const idx = line.indexOf(":");
      if (idx === -1) continue;
      const keyPart = line.substring(0, idx);
      const value = line.substring(idx + 1);
      // key may have params like TEL;TYPE=cell
      const key = keyPart.split(/;|\\s/)[0].toUpperCase();
      if (!fields[key]) fields[key] = [];
      fields[key].push(value.replace(/\\r|\\n/g, "\n"));
    }

    const name =
      (fields["FN"] && fields["FN"][0]) ||
      (fields["N"] && fields["N"][0].split(";").reverse().join(" ")) ||
      "Unknown Name";
    const phones = fields["TEL"] || [];
    const emails = fields["EMAIL"] || [];
    const org = (fields["ORG"] && fields["ORG"][0]) || undefined;
    const title = (fields["TITLE"] && fields["TITLE"][0]) || undefined;
    const adr = (fields["ADR"] && fields["ADR"][0]) || undefined;
    const url = (fields["URL"] && fields["URL"][0]) || undefined;
    const note = (fields["NOTE"] && fields["NOTE"][0]) || undefined;

    const parts: string[] = ["Contact Information", `Name: ${name}`];
    if (org) parts.push(`Organization: ${org}`);
    if (title) parts.push(`Title: ${title}`);
    if (phones.length) parts.push(`Phone(s): ${phones.join(", ")}`);
    if (emails.length) parts.push(`Email(s): ${emails.join(", ")}`);
    if (adr) parts.push(`Address: ${adr.replace(/;/g, " ")}`);
    if (url) parts.push(`URL: ${url}`);
    if (note) parts.push(`Note: ${note}`);

    return parts.join("\n");
  } else {
    return content;
  }
}
