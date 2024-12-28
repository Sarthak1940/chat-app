export const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/v1/auth";

export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO_ROUTE = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateProfile`;
export const UPDATE_IMAGE_ROUTE = `${AUTH_ROUTES}/updateImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTE = "api/v1/contacts";

export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/search`;
export const GET_CONTACTS_FOR_DM_ROUTE = `${CONTACTS_ROUTE}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTE}/get-all-contacts`;

export const MESSAGES_ROUTE = "api/v1/messages";

export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const UPLOAD_FILES_ROUTE = `${MESSAGES_ROUTE}/upload-files`;

export const CHANNELS_ROUTE = "api/v1/channels";

export const CREATE_CHANNEL_ROUTE = `${CHANNELS_ROUTE}/create-channel`;
export const GET_CHANNELS_ROUTE = `${CHANNELS_ROUTE}/get-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNELS_ROUTE}/get-channel-messages`;