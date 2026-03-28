# Cloud Media

Cloud Media is an Expo Router mobile app for authenticated media browsing and uploads. Users can sign up, log in, view their gallery, mark items as favourites, upload photos or videos, and inspect their profile from a tab-based interface.

## Features

- Email/password authentication with signup and login screens
- Secure token storage using `expo-secure-store`
- Automatic session expiry handling
- Media gallery with paginated loading
- Local media caching fallback when gallery fetch fails
- Favourite toggle support
- Upload flow for images and videos from camera or gallery
- Profile screen backed by stored user data

## Tech Stack

- Expo SDK 54
- React Native 0.81
- React 19
- Expo Router
- Axios
- TypeScript
- AsyncStorage
- Expo Image Picker
- Expo Secure Store
- Expo Video

## Project Structure

```text
app/
  (auth)/
    login.tsx
    signup.tsx
  (tabs)/
    home.tsx
    favorites.tsx
    profile.tsx
    _layout.tsx
  imageUpload/
    upload.tsx
  _layout.tsx
  index.tsx

src/
  api/
  components/
  services/
  utils/
  Theam.ts
```

## App Flow

1. `app/index.tsx` checks whether a token exists.
2. Authenticated users are redirected to `/home`.
3. Unauthenticated users are redirected to `/login`.
4. The root layout monitors token expiry and clears auth data when the session ends.

## API Configuration

The app currently uses a hardcoded backend base URL in [src/api/client.ts](/c:/Users/DELL/Desktop/yash/CloudMedia/uiCloudMedia/cloud-media/src/api/client.ts):

```ts
http://3.110.216.101:3000/api/
```

Available API usage in the project:

- `POST /auth/signup`
- `POST /auth/login`
- `GET /media/getimages`
- `GET /media/favorites`
- `PUT /media/:mediaId/favorite`
- `POST /media/upload`

## Session Handling

- Tokens are stored with `expo-secure-store`
- User data is stored alongside the token
- Session duration is currently set to 1 hour in [src/utils/storage.ts](/c:/Users/DELL/Desktop/yash/CloudMedia/uiCloudMedia/cloud-media/src/utils/storage.ts)
- On `401` responses from protected routes, auth data is cleared and the user is sent back to login

## Upload Behavior

- Users can capture media with the camera or select it from the gallery
- The upload screen supports images and videos
- File size is limited to 5 MB in the UI
- Uploads are sent as `multipart/form-data`

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Expo Go app or Android/iOS simulator

### Install

```bash
npm install
```

### Run the app

```bash
npm start
```

Useful scripts:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Notes

- The backend URL is hardcoded, so if the API host changes you will need to update [src/api/client.ts](/c:/Users/DELL/Desktop/yash/CloudMedia/uiCloudMedia/cloud-media/src/api/client.ts).
- The repository still includes the default Expo `reset-project` script in `package.json`, but the supporting `scripts/` folder is not present in this project.
- Some files contain encoding artifacts in UI text/comments from earlier edits; this README reflects project behavior rather than those display issues.

## Future Improvements

- Move API base URL to environment-based config
- Add proper pagination metadata handling for favourites
- Add tests for auth, upload, and caching flows
- Improve media validation and upload feedback
