# 游戏王卡片制作器[Mato版]

一款跨平台的卡片制作器，采用 Electron 制作。

基于rarnu和kooriookami两位大佬的卡片制作器基础上增添了一些功能的制卡器。
在此处感谢rarnu和kooriookami为游戏王DIY事业做出的贡献(不是)

- - -

编译方法:

```shell
$ git clone https://github.com/DDDDDragon/Yugioh-DIY.git
$ cd Yugioh-DIY
$ npm install
$ npm run package
```

- - -

CHANGELOG:
之前版本的CHANGELOG请看https://github.com/rarnu/electron-diy

**3.7.0**

1. 增加导入自定义字体并保存至本地配置的功能
2. 增加导入CDB, 自动填入卡片参数的功能
3. 由于本制卡器原版所对应的网络服务即将到期退役, 修改了部分源码除去了联网请求操作, 以防无法连接导致的NetWork Error刷屏

**3.7.1预计更新**

1. 导入卡图时裁剪卡图的功能(其实网页版是有这个功能的, 不过rarnu大佬貌似没在源码中更新此功能)