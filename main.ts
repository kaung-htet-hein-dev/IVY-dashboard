import {
  check,
  checkMultiple,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS
} from "react-native-permissions";
import { Alert, Platform } from "react-native";
import translate from "../i18n";
import metrics from "../theme/metrics";

export async function permissionGallery() {
  const galleryIos = PERMISSIONS.IOS.PHOTO_LIBRARY;
  const galleryAndroid = PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  // Permission for all media [PERMISSIONS.ANDROID.READ_MEDIA_AUDIO, PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, PERMISSIONS.ANDROID.READ_MEDIA_VIDEO]
  const mediaAndroid = [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES];
  const galleryTitle = translate("GALLERY_PERMISSION");
  const galleryDetail = translate("GALLERY_PERMISSION_DETAIL");
  const mediaTitle = translate("MEDIA_PERMISSION");
  const mediaDetail = translate("MEDIA_PERMISSION_DETAIL");
  const permissionTitle = "Permission Error";
  const permissionDetail = "Something went wrong about permission";
  let returnStatus = false;

  let checkPermission = null;

  if (metrics.platform === "ios") {
    checkPermission = galleryIos;
  } else if (metrics.platform === "android") {
    if (Platform.Version >= 33) {
      checkPermission = mediaAndroid;
    } else {
      checkPermission = galleryAndroid;
    }
  }

  // Check permission gallery
  if (
    // (metrics.platform === "android" && Platform.Version < 33) ||
    metrics.platform === "ios"
  ) {
    await check(checkPermission)
      .then(async (result) => {
        if (result === RESULTS.GRANTED) {
          returnStatus = true;
        } else {
          await request(checkPermission).then((result) => {
            if (result !== RESULTS.GRANTED) {
              Alert.alert(
                galleryTitle,
                galleryDetail,
                [
                  {
                    text: translate("OK").toUpperCase(),
                    onPress: () => {},
                    style: "cancel"
                  }
                ],
                { cancelable: true }
              );
            }
          });
        }
      })
      .catch((error) => {
        Alert.alert(
          permissionTitle,
          permissionDetail,
          [
            {
              text: translate("OK").toUpperCase(),
              onPress: () => {},
              style: "cancel"
            }
          ],
          { cancelable: true }
        );
      });
  }

  return returnStatus;
}

export async function permissionCamera() {
  const permissionCamera =
    metrics.platform === "ios"
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  const cameraTitle = translate("CAMERA_PERMISSION");
  const cameraDetail = translate("CAMERA_PERMISSION_DETAIL");
  const permissionTitle = "Permission Error";
  const permissionDetail = "Something went wrong about permission";
  let returnStatus = false;

  // Check permission gallery or media

  await permissionGallery().then(async (resultGallery) => {
    await check(permissionCamera)
      .then(async (result) => {
        if (result === RESULTS.GRANTED) {
          if (resultGallery) {
            returnStatus = true;
          }
        } else {
          await request(permissionCamera).then((result) => {
            if (result !== RESULTS.GRANTED) {
              Alert.alert(
                cameraTitle,
                cameraDetail,
                [
                  {
                    text: translate("OK").toUpperCase(),
                    onPress: () => {},
                    style: "cancel"
                  }
                ],
                { cancelable: true }
              );
            } else if (result === RESULTS.GRANTED) {
              returnStatus = true;
            }
          });
        }
      })
      .catch((error) => {
        Alert.alert(
          permissionTitle,
          permissionDetail,
          [
            {
              text: translate("OK").toUpperCase(),
              onPress: () => {},
              style: "cancel"
            }
          ],
          { cancelable: true }
        );
      });
  });
  return returnStatus;
}
