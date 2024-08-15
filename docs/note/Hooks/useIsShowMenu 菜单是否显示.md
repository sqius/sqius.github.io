# useIsShowMenu 菜单是否显示

``` ts
export type RoutersDataType = typeof routersData;
export type RoutersDataKey = keyof RoutersDataType;
```

``` tsx
import { routersData, RoutersDataKey } from "@/app/config";
import { useLocation } from "react-router-dom";

function useIsShowMenu() {
  const location = useLocation();
  const routeKey: RoutersDataKey = location.pathname?.split(
    "/"
  )[1] as RoutersDataKey;

  if (!routeKey) return false;

  return !!routersData[routeKey];
}

export default useIsShowMenu;

```