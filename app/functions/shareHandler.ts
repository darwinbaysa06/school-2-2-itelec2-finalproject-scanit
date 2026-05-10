import { Alert, Share } from "react-native";

const onShare = async (shareContent: string) => {
  try {
    const result = await Share.share({
      message: shareContent,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
export { onShare };
