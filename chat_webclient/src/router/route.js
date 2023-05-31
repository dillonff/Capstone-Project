import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";

const routes = [
  {
    path: "/",
    component: React.lazy(() => import("../App.js")),
    children: [

    ],
  },
  {
    path: "/login",
    component: React.lazy(() => import("../components/SimpleLogin")),
    children: [

    ],
  },
  {
    path: "/Workspace",
    component: React.lazy(() => import("../components/Workspace.jsx")),
    children: [
      
    ]
  },
   {
     path: "/file",
     component: React.lazy(() => import("../components/file.jsx")),
     children: [
      
     ]
   },
   {
    path: "/editprofile",
    component: React.lazy(() => import("../components/editprofile.jsx")),
    children: [
     
    ]
  },
  {
    path: "/changepassword",
    component: React.lazy(() => import("../components/Changepassword.jsx")),
    children: [
     
    ]
  },
];

const syncRouter = (routes) => {
  const mRouteTable = [];
  routes.forEach((route) => {
    mRouteTable.push({
      path: route.path,
      element: (
        <Suspense fallback={<div>loading...</div>}>
          <route.component />
        </Suspense>
      ),
      children: route.children && syncRouter(route.children),
    });
  });
  return mRouteTable;
};

export default () => useRoutes(syncRouter(routes));