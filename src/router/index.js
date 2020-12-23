import Vue from 'vue'
import Home from '../components/Home'
// import Rule from '../components/rule/Rule'
// import Login from '../components/Login'
// import Register from '../components/Register'
// import Device from '../components/device/Device'
// import MessageRouting from '../components/messagerouting/MessageRouting'
// import AppIndex from '../components/home/AppIndex'
// import ProfileIndex from '../components/profile/ProfileIndex'
// import DeviceProfile from '../components/profile/DeviceProfile'
// import LogIndex from '../components/log/LogIndex'
// import OamLog from '../components/log/OamLog'
// import GwinstLog from '../components/log/GwinstLog'
// import ScenarioIndex from '../components/Scenario/ScenarioIndex'
// import ScenarioService from '../components/Scenario/ScenarioService'
// import MessageRoutingIndex from '../components/messagerouting/MessageRoutingIndex'
// import RuleIndex from '../components/rule/RuleIndex'
// import DeviceIndex from '../components/device/DeviceIndex'
// import GatewayIndex from '../components/gateway/GatewayIndex'
// import Gateway from '../components/gateway/Gateway'
// import CommandIndex from '../components/command/CommandIndex'
// import Command from '../components/command/Command'
// import DeviceMonitor from '../components/device/DeviceMonitor'
// import ScenarioShow from '../components/Scenario/ScenarioShow'
// import ServiceManage from '../components/gateway/ServiceManage'
// import GatewayService from '../components/gateway/GatewayService'
// import ProfileLib from '../components/profile/ProfileLib'

import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history', // 将模式转换成history模式
  // base: '/bjtu/', // 配置路由的根目录
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/socketConfig'
    },
    {
      path: '/socketConfig',
      name: 'SocketConfig',
      component: () => import('../components/SocketConfig')
    },
    {
      // home页面不需要被访问，只是作为其他组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/messageCenter',
          name: 'MessageCenter',
          component: () => import('../components/common/MessageCenter')
        }
        // {
        //   path: '/index',
        //   name: 'AppIndex',
        //   component: () => import('../components/home/AppIndex'),
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        // {
        //   path: '/userInfo',
        //   name: 'Person',
        //   component: () => import('../components/home/userSetting/Person'),
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        // {
        //   path: '/ruleIndex',
        //   name: 'RuleIndex',
        //   component: () => import('../components/rule/RuleIndex'),
        //   redirect: '/rule',
        //   children: [
        //     {
        //       path: '/rule',
        //       name: 'Rule',
        //       component: () => import('../components/rule/Rule'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/gatewayIndex',
        //   name: 'GatewayIndex',
        //   component: () => import('../components/gateway/GatewayIndex'),
        //   redirect: '/gateway',
        //   children: [
        //     {
        //       path: '/gateway',
        //       name: 'Gateway',
        //       component: () => import('../components/gateway/Gateway'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/gatewayService',
        //       name: 'GatewayServcie',
        //       component: () => import('../components/gateway/GatewayService'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/serviceManage',
        //       name: 'ServiceManage',
        //       component: () => import('../components/gateway/ServiceManage'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/deviceIndex',
        //   name: 'DeviceIndex',
        //   component: () => import('../components/device/DeviceIndex'),
        //   redirect: '/device',
        //   children: [
        //     {
        //       path: '/device',
        //       name: 'Device',
        //       component: () => import('../components/device/Device'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/monitor',
        //       name: 'DeviceMonitor',
        //       component: () => import('../components/device/DeviceMonitor'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/messageRoutingIndex',
        //   name: 'MessageRoutingIndex',
        //   component: () => import('../components/messagerouting/MessageRoutingIndex'),
        //   redirect: '/messageRouting',
        //   children: [
        //     {
        //       path: '/messageRouting',
        //       name: 'MessageRouting',
        //       component: () => import('../components/messagerouting/MessageRouting'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/profileIndex',
        //   name: 'ProfileIndex',
        //   component: () => import('../components/profile/ProfileIndex'),
        //   redirect: '/deviceProfile',
        //   children: [
        //     {
        //       path: '/deviceProfile',
        //       name: 'DeviceProfile',
        //       component: () => import('../components/profile/DeviceProfile'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/profileLib',
        //       name: 'ProfileLib',
        //       component: () => import('../components/profile/ProfileLib'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/scenarioIndex',
        //   name: 'ScenarioIndex',
        //   component: () => import('../components/Scenario/ScenarioIndex'),
        //   redirect: '/scenario',
        //   children: [
        //     {
        //       path: '/scenario',
        //       name: 'ScenarioService',
        //       component: () => import('../components/Scenario/ScenarioService'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/scenarioShow',
        //       name: 'ScenarioShow',
        //       component: () => import('../components/Scenario/ScenarioShow'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/commandIndex',
        //   name: 'CommandIndex',
        //   component: () => import('../components/command/CommandIndex'),
        //   redirect: '/command',
        //   children: [
        //     {
        //       path: '/command',
        //       name: 'Command',
        //       component: () => import('../components/command/Command'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/logIndex',
        //   name: 'LogIndex',
        //   component: () => import('../components/log/LogIndex'),
        //   redirect: '/oamlog',
        //   children: [
        //     {
        //       path: '/oamlog',
        //       name: 'OamLog',
        //       component: () => import('../components/log/OamLog'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/gwinstLog',
        //       name: 'GwinstLog',
        //       component: () => import('../components/log/GwinstLog'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/Login')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/Register')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../components/admin/AdminIndex'),
      meta: {
        requireAuth: true
      },
      children: [
        // {
        //   path: '/admin/dashboard',
        //   name: 'Dashboard',
        //   component: () => import('../components/admin/dashboard/admin/index'),
        //   meta: {
        //     requireAuth: true
        //   }
        // }
      ]
    }
    // {
    //   path: '*',
    //   component: () => import('../components/pages/Error404')
    // }
  ]
  // routes: [
  //   {
  //     path: '/',
  //     name: 'Home',
  //     component: Home,
  //     // meta: {
  //     //   requireAuth: true
  //     // },
  //     children: [
  //       {
  //         path: '/index',
  //         name: 'AppIndex',
  //         component: AppIndex
  //         // meta: {
  //         //   requireAuth: true
  //         // }
  //       },
  //       {
  //         path: '/ruleIndex',
  //         name: 'RuleIndex',
  //         component: RuleIndex,
  //         redirect: '/rule',
  //         children: [
  //           {
  //             path: '/rule',
  //             name: 'Rule',
  //             component: Rule
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/gatewayIndex',
  //         name: 'GatewayIndex',
  //         component: GatewayIndex,
  //         redirect: '/gateway',
  //         children: [
  //           {
  //             path: '/gateway',
  //             name: 'Gateway',
  //             component: Gateway
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/gatewayService',
  //             name: 'GatewayServcie',
  //             component: GatewayService
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/serviceManage',
  //             name: 'ServiceManage',
  //             component: ServiceManage
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/deviceIndex',
  //         name: 'DeviceIndex',
  //         component: DeviceIndex,
  //         redirect: '/device',
  //         children: [
  //           {
  //             path: '/device',
  //             name: 'Device',
  //             component: Device
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/monitor',
  //             name: 'DeviceMonitor',
  //             component: DeviceMonitor
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/messageRoutingIndex',
  //         name: 'MessageRoutingIndex',
  //         component: MessageRoutingIndex,
  //         redirect: '/messageRouting',
  //         children: [
  //           {
  //             path: '/messageRouting',
  //             name: 'MessageRouting',
  //             component: MessageRouting
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/profileIndex',
  //         name: 'ProfileIndex',
  //         component: ProfileIndex,
  //         redirect: '/deviceProfile',
  //         children: [
  //           {
  //             path: '/deviceProfile',
  //             name: 'DeviceProfile',
  //             component: DeviceProfile
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/profileLib',
  //             name: 'ProfileLib',
  //             component: ProfileLib
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/scenarioIndex',
  //         name: 'ScenarioIndex',
  //         component: ScenarioIndex,
  //         redirect: '/scenario',
  //         children: [
  //           {
  //             path: '/scenario',
  //             name: 'ScenarioService',
  //             component: ScenarioService
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/scenarioShow',
  //             name: 'ScenarioShow',
  //             component: ScenarioShow
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/commandIndex',
  //         name: 'CommandIndex',
  //         component: CommandIndex,
  //         redirect: '/command',
  //         children: [
  //           {
  //             path: '/command',
  //             name: 'Command',
  //             component: Command
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       },
  //       {
  //         path: '/logIndex',
  //         name: 'LogIndex',
  //         component: LogIndex,
  //         redirect: '/oamlog',
  //         children: [
  //           {
  //             path: '/oamlog',
  //             name: 'OamLog',
  //             component: OamLog
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           },
  //           {
  //             path: '/gwinstLog',
  //             name: 'GwinstLog',
  //             component: GwinstLog
  //             // meta: {
  //             //   requireAuth: true
  //             // }
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: Login
  //   },
  //   {
  //     path: '/register',
  //     name: 'register',
  //     component: Register
  //   }
  // ]
})

// 用于创建默认路由
export const createRouter = routes => new Router({
  model: 'history',
  routes: [
    {
      path: '/',
      name: 'Default',
      redirect: '/socketConfig',
      component: Home
    },
    {
      path: '/socketConfig',
      name: 'SocketConfig',
      component: () => import('../components/SocketConfig')
    },
    {
      // home页面不需要被访问，只是作为其他组件的父组件
      path: '/home',
      name: 'Home',
      component: Home,
      // redirect: '/index',
      meta: {
        requireAuth: true
      },
      children: [
        // {
        //   path: '/index',
        //   name: 'AppIndex',
        //   component: () => import('../components/home/AppIndex'),
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        // {
        //   path: '/user',
        //   name: 'Person',
        //   component: () => import('../components/home/userSetting/Person'),
        //   meta: {
        //     requireAuth: true
        //   }
        // },
        // {
        //   path: '/ruleIndex',
        //   name: 'RuleIndex',
        //   component: () => import('../components/rule/RuleIndex'),
        //   redirect: '/rule',
        //   children: [
        //     {
        //       path: '/rule',
        //       name: 'Rule',
        //       component: () => import('../components/rule/Rule'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/gatewayIndex',
        //   name: 'GatewayIndex',
        //   component: () => import('../components/gateway/GatewayIndex'),
        //   redirect: '/gateway',
        //   children: [
        //     {
        //       path: '/gateway',
        //       name: 'Gateway',
        //       component: () => import('../components/gateway/Gateway'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/gatewayService',
        //       name: 'GatewayServcie',
        //       component: () => import('../components/gateway/GatewayService'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/serviceManage',
        //       name: 'ServiceManage',
        //       component: () => import('../components/gateway/ServiceManage'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/deviceIndex',
        //   name: 'DeviceIndex',
        //   component: () => import('../components/device/DeviceIndex'),
        //   redirect: '/device',
        //   children: [
        //     {
        //       path: '/device',
        //       name: 'Device',
        //       component: () => import('../components/device/Device'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/monitor',
        //       name: 'DeviceMonitor',
        //       component: () => import('../components/device/DeviceMonitor'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/messageRoutingIndex',
        //   name: 'MessageRoutingIndex',
        //   component: () => import('../components/messagerouting/MessageRoutingIndex'),
        //   redirect: '/messageRouting',
        //   children: [
        //     {
        //       path: '/messageRouting',
        //       name: 'MessageRouting',
        //       component: () => import('../components/messagerouting/MessageRouting'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/profileIndex',
        //   name: 'ProfileIndex',
        //   component: () => import('../components/profile/ProfileIndex'),
        //   redirect: '/deviceProfile',
        //   children: [
        //     {
        //       path: '/deviceProfile',
        //       name: 'DeviceProfile',
        //       component: () => import('../components/profile/DeviceProfile'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/profileLib',
        //       name: 'ProfileLib',
        //       component: () => import('../components/profile/ProfileLib'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/scenarioIndex',
        //   name: 'ScenarioIndex',
        //   component: () => import('../components/Scenario/ScenarioIndex'),
        //   redirect: '/scenario',
        //   children: [
        //     {
        //       path: '/scenario',
        //       name: 'ScenarioService',
        //       component: () => import('../components/Scenario/ScenarioService'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/scenarioShow',
        //       name: 'ScenarioShow',
        //       component: () => import('../components/Scenario/ScenarioShow'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/commandIndex',
        //   name: 'CommandIndex',
        //   component: () => import('../components/command/CommandIndex'),
        //   redirect: '/command',
        //   children: [
        //     {
        //       path: '/command',
        //       name: 'Command',
        //       component: () => import('../components/command/Command'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // },
        // {
        //   path: '/logIndex',
        //   name: 'LogIndex',
        //   component: () => import('../components/log/LogIndex'),
        //   redirect: '/oamlog',
        //   children: [
        //     {
        //       path: '/oamlog',
        //       name: 'OamLog',
        //       component: () => import('../components/log/OamLog'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     },
        //     {
        //       path: '/gwinstLog',
        //       name: 'GwinstLog',
        //       component: () => import('../components/log/GwinstLog'),
        //       meta: {
        //         requireAuth: true
        //       }
        //     }
        //   ]
        // }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/Login')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../components/Register')
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../components/admin/AdminIndex'),
      meta: {
        requireAuth: true
      },
      children: [
        // {
        //   path: '/admin/dashboard',
        //   name: 'Dashboard',
        //   component: () => import('../components/admin/dashboard/admin/index'),
        //   meta: {
        //     requireAuth: true
        //   }
        // }
      ]
    }
    // {
    //   path: '*',
    //   component: () => import('../components/pages/Error404')
    // }
  ]
})
