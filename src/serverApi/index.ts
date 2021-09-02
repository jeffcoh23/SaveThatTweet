import getEnvVars from "../../environment";
import { currentUserStore } from "../stores/CurrentUserStore";

// import getEnvVars from 'en'
const serverApi = {
  post(url: string, body: object) {
    return fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: currentUserStore.authToken,
      },
      body: JSON.stringify({
        body,
      }),
    });
  },

  put(url: string, body: object) {
    return fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: currentUserStore.authToken,
      },
      body: JSON.stringify({
        body,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res;
      }
    });
  },

  get(href: string): Promise<any> {
    return fetch(href, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: currentUserStore.authToken,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res;
      }
    });
  },

  register(redirect: string): Promise<any> {
    return fetch(`${getEnvVars().apiUrl}/socials?callback_url=${redirect}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res;
      }
    });
  },
  delete(path: string) {
    return fetch(path, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: currentUserStore.authToken,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res;
      }
    });
  },

  createSession(
    oauth_token: string,
    oauth_token_secret: string,
    oauth_verifier: string
  ): Promise<any> {
    return fetch(`${getEnvVars().apiUrl}/auth/twitter/callback`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw res;
      }
    });
  },
};

export default serverApi;

///auth/twitter/callback
