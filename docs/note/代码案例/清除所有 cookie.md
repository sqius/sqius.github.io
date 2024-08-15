# 清除所有 cookie

``` ts
export const clearAllCookie = () => {
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (let i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
  }
};
```