const backendUrl = process.env.REACT_APP_BACKEND_URL;

const getTodoToken = () => {
    const encryptedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
    ?.split("=")[1];
    
    if (encryptedToken) {
        return atob(encryptedToken); // Decrypt the token using base64 decoding
    }
    return null;
};
export { backendUrl, getTodoToken };