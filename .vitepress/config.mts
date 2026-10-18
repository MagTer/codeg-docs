import { defineConfig } from 'vitepress'

// Deployed to GitHub Pages on the custom domain https://docs.codeg.app/, which
// serves at the domain root — so `base` is '/' (no repo path segment) and the
// `public/CNAME` file pins the domain across deploys. `siteUrl` is the absolute
// site root, reused for the sitemap, canonical links, and OpenGraph tags.
// (Falling back to the default github.io/codeg-docs/ URL would need base: '/codeg-docs/'.)
const base = '/'
const hostname = 'https://docs.codeg.app'
const siteUrl = `${hostname}${base}`
const ogImage = `${siteUrl}images/main-light.png`

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Codeg',
  description:
    'A multi-agent coding workspace — bring Claude Code, Codex, Gemini, OpenCode and more into one place.',
  base,
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: siteUrl },

  // Shared <head>: favicon + the locale-neutral OpenGraph/Twitter tags. Per-page
  // canonical/title/description/locale are injected in transformHead below, so
  // every page advertises itself rather than the site default.
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}icon.svg` }],
    ['meta', { name: 'theme-color', content: '#1a1a2e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Codeg' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }]
  ],

  transformHead({ pageData, title, description }) {
    // relativePath → clean site path: index.md → '', zh/index.md → 'zh/',
    // guide/x.md → 'guide/x'. Mirrors cleanUrls output, so canonical/og:url are
    // the real page URLs.
    const path = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '')
    const url = `${siteUrl}${path}`
    const isZh = pageData.relativePath.startsWith('zh/')
    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:locale', content: isZh ? 'zh_CN' : 'en_US' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  },

  // drafts/ holds the zh translation guide (conventions + glossary for the zh
  // mirror); it's kept in the repo but is not part of the built site.
  srcExclude: ['drafts/**'],

  themeConfig: {
    // Shared across every locale (deep-merged into each locale's themeConfig).
    logo: '/icon.svg',
    socialLinks: [{ icon: 'github', link: 'https://github.com/spacering-net/codeg' }],

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '关闭搜索',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          }
        }
      }
    }
  },

  locales: {
    // ---- English (default, served at / ) ----
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Getting Started', link: '/getting-started/', activeMatch: '/getting-started/' },
          { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
          { text: 'Reference', link: '/reference/', activeMatch: '/reference/' },
          { text: 'About', link: '/about' }
        ],

        sidebar: {
          '/getting-started/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/getting-started/' },
                { text: 'Download & Install', link: '/getting-started/installation' },
                { text: 'Deployment', link: '/getting-started/deployment' },
                { text: 'Configuration', link: '/getting-started/configuration' }
              ]
            }
          ],

          '/guide/': [
            { text: 'Overview', link: '/guide/' },
            {
              text: 'Essentials',
              items: [
                { text: 'The Workspace', link: '/guide/workspace' },
                { text: 'Conversations', link: '/guide/conversations' },
                { text: 'The Side Panel', link: '/guide/side-panel' },
                { text: 'Git & Worktrees', link: '/guide/git' },
                { text: 'Infinite Canvas', link: '/guide/canvas' },
                { text: 'Conversation Aggregation', link: '/guide/aggregation' },
                { text: 'Token Usage', link: '/guide/token-usage' }
              ]
            },
            {
              text: 'Agents',
              items: [
                { text: 'Working with Agents', link: '/guide/agents' },
                { text: 'Supported Agents', link: '/guide/supported-agents' },
                { text: 'Per-Agent Setup', link: '/guide/agent-setup' },
                { text: 'Authentication & Models', link: '/guide/authentication' },
                { text: 'Custom Agents', link: '/guide/custom-agents' }
              ]
            },
            {
              text: 'Collaboration',
              items: [
                { text: 'Multi-Agent Collaboration', link: '/guide/multi-agent' },
                { text: 'Assistants', link: '/guide/assistants' }
              ]
            },
            {
              text: 'Tools & Extensions',
              items: [
                { text: 'Built-in Browser', link: '/guide/browser' },
                { text: 'Computer Use', link: '/guide/computer-use' },
                { text: 'MCP Servers', link: '/guide/mcp' },
                { text: 'Skills', link: '/guide/skills' }
              ]
            },
            {
              text: 'Channels & Automation',
              items: [
                { text: 'Command Line', link: '/guide/command-line' },
                { text: 'Chat Channels', link: '/guide/chat-channels' },
                { text: 'Automations', link: '/guide/automations' },
                { text: 'To-dos', link: '/guide/tasks' },
                { text: 'Repository Panel', link: '/guide/repository' }
              ]
            },
            {
              text: 'Domain Workflows',
              items: [
                { text: 'Office Documents', link: '/guide/office' },
                { text: 'Scientific Research', link: '/guide/research' },
                { text: 'Project Boot', link: '/guide/project-boot' }
              ]
            }
          ],

          '/reference/': [
            { text: 'Overview', link: '/reference/' },
            {
              text: 'Settings',
              items: [
                { text: 'Appearance', link: '/reference/settings/appearance' },
                { text: 'General', link: '/reference/settings/general' },
                { text: 'Collaboration', link: '/reference/settings/collaboration' },
                { text: 'Quick Messages', link: '/reference/settings/quick-messages' },
                { text: 'Browser Use', link: '/reference/settings/browser' },
                { text: 'Computer Use', link: '/reference/settings/computer-use' },
                { text: 'Shortcuts', link: '/reference/settings/shortcuts' },
                { text: 'Version Control', link: '/reference/settings/version-control' },
                { text: 'Web Service', link: '/reference/settings/web-service' },
                { text: 'Runtime Logs', link: '/reference/settings/logs' },
                { text: 'System', link: '/reference/settings/system' }
              ]
            },
            {
              text: 'Architecture & Security',
              items: [
                { text: 'Architecture', link: '/reference/architecture' },
                { text: 'Privacy & Security', link: '/reference/privacy' }
              ]
            },
            {
              text: 'Contributing',
              items: [{ text: 'Development', link: '/reference/development' }]
            }
          ]
        },

        footer: {
          message: 'Released under the Apache-2.0 License.',
          copyright: 'Copyright © 2026-present Codeg'
        }
      }
    },

    // ---- 简体中文 (served at /zh/ ) ----
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description:
        '多智能体编程工作区——将 Claude Code、Codex、Gemini、OpenCode 等汇聚一处。',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/zh/getting-started/', activeMatch: '/zh/getting-started/' },
          { text: '指南', link: '/zh/guide/', activeMatch: '/zh/guide/' },
          { text: '参考', link: '/zh/reference/', activeMatch: '/zh/reference/' },
          { text: '关于', link: '/zh/about' }
        ],

        sidebar: {
          '/zh/getting-started/': [
            {
              text: '快速开始',
              items: [
                { text: '简介', link: '/zh/getting-started/' },
                { text: '下载与安装', link: '/zh/getting-started/installation' },
                { text: '部署', link: '/zh/getting-started/deployment' },
                { text: '配置', link: '/zh/getting-started/configuration' }
              ]
            }
          ],

          '/zh/guide/': [
            { text: '概览', link: '/zh/guide/' },
            {
              text: '核心功能',
              items: [
                { text: '工作区', link: '/zh/guide/workspace' },
                { text: '对话', link: '/zh/guide/conversations' },
                { text: '右侧面板', link: '/zh/guide/side-panel' },
                { text: 'Git 与 Worktree', link: '/zh/guide/git' },
                { text: '无限画布', link: '/zh/guide/canvas' },
                { text: '对话聚合', link: '/zh/guide/aggregation' },
                { text: 'Token 用量', link: '/zh/guide/token-usage' }
              ]
            },
            {
              text: '智能体',
              items: [
                { text: '使用智能体', link: '/zh/guide/agents' },
                { text: '支持的智能体', link: '/zh/guide/supported-agents' },
                { text: '各智能体配置', link: '/zh/guide/agent-setup' },
                { text: '认证与模型', link: '/zh/guide/authentication' },
                { text: '自定义智能体', link: '/zh/guide/custom-agents' }
              ]
            },
            {
              text: '协作',
              items: [
                { text: '多智能体协作', link: '/zh/guide/multi-agent' },
                { text: '助手', link: '/zh/guide/assistants' }
              ]
            },
            {
              text: '工具与扩展',
              items: [
                { text: '内置浏览器', link: '/zh/guide/browser' },
                { text: '电脑操作', link: '/zh/guide/computer-use' },
                { text: 'MCP 服务器', link: '/zh/guide/mcp' },
                { text: '技能', link: '/zh/guide/skills' }
              ]
            },
            {
              text: '频道与自动化',
              items: [
                { text: '命令行', link: '/zh/guide/command-line' },
                { text: '聊天频道', link: '/zh/guide/chat-channels' },
                { text: '自动化', link: '/zh/guide/automations' },
                { text: '待办任务', link: '/zh/guide/tasks' },
                { text: '仓库面板', link: '/zh/guide/repository' }
              ]
            },
            {
              text: '领域工作流',
              items: [
                { text: 'Office 文档', link: '/zh/guide/office' },
                { text: '科学研究', link: '/zh/guide/research' },
                { text: '项目引导', link: '/zh/guide/project-boot' }
              ]
            }
          ],

          '/zh/reference/': [
            { text: '概览', link: '/zh/reference/' },
            {
              text: '设置',
              items: [
                { text: '外观', link: '/zh/reference/settings/appearance' },
                { text: '常规', link: '/zh/reference/settings/general' },
                { text: '协作', link: '/zh/reference/settings/collaboration' },
                { text: '快捷消息', link: '/zh/reference/settings/quick-messages' },
                { text: '浏览器操作', link: '/zh/reference/settings/browser' },
                { text: '电脑操作', link: '/zh/reference/settings/computer-use' },
                { text: '快捷键', link: '/zh/reference/settings/shortcuts' },
                { text: '版本控制', link: '/zh/reference/settings/version-control' },
                { text: 'Web 服务', link: '/zh/reference/settings/web-service' },
                { text: '运行日志', link: '/zh/reference/settings/logs' },
                { text: '系统', link: '/zh/reference/settings/system' }
              ]
            },
            {
              text: '架构与安全',
              items: [
                { text: '架构', link: '/zh/reference/architecture' },
                { text: '隐私与安全', link: '/zh/reference/privacy' }
              ]
            },
            {
              text: '参与贡献',
              items: [{ text: '开发', link: '/zh/reference/development' }]
            }
          ]
        },

        footer: {
          message: '基于 Apache-2.0 许可证发布。',
          copyright: 'Copyright © 2026-present Codeg'
        },

        docFooter: { prev: '上一页', next: '下一页' },
        outline: { label: '页面导航' },
        lastUpdated: { text: '最后更新于' },
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言'
      }
    }
  }
})
