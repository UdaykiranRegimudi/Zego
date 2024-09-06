// src/ZegoCall.js
import React, { useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const ZegoCall = () => {
  const appID = 1484647939; // Replace with your appID
  const serverUrl = 'https://nextjs-token.vercel.app/api'; // Your backend URL

  // Function to generate a random ID
  function randomID(len) {
    let result = '';
    var chars =
      '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  // Function to get URL parameters
  function getUrlParams(url) {
    let urlStr = url.split('?')[1];
    const urlSearchParams = new URLSearchParams(urlStr);
    const result = Object.fromEntries(urlSearchParams.entries());
    return result;
  }

  // Function to generate token from your backend
  async function generateToken(tokenServerUrl, userID) {
    return fetch(
      `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
      {
        method: 'GET',
      }
    ).then((res) => res.json());
  }

  // Initialize the video call
  async function init() {
    const roomID = getUrlParams(window.location.href)['roomID'] || randomID(5);
    const userID = randomID(5);
    const userName = randomID(5);

    const { token } = await generateToken(serverUrl, userID);

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID,
      token,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    let sharedLinks = [
      {
        name: 'Personal link',
        url:
          window.location.origin + window.location.pathname + '?roomID=' + roomID,
      },
    ];

    zp.joinRoom({
      container: document.getElementById('zego-container'),
      maxUsers: 4,
      branding: {
        logoURL:
          'https://www.zegocloud.com/_nuxt/img/zegocloud_logo_white.ddbab9f.png',
      },
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      sharedLinks,
    });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      <h1>ZegoCloud Video Call</h1>
      <div id="zego-container" style={{ width: '100%', height: '600px' }}></div>
    </div>
  );
};

export default ZegoCall;
