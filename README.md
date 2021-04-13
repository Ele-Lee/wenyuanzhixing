## 题目

使用 html + js 写一个马赛克画板（2.1 版）：

1. 页面加载时，要求用户输入两个整数，对应长和宽，例如 100, 200
2. 页面显示 100\*200 个格子，要求占满整个窗口，不能有滚动条。
3. 当窗口大小变化时，依然要满足上述条件
4. 鼠标左键点击任意一个格子时，填入一个随机颜色，即#000000-#FFFFFF 中的一种
5. 鼠标右键点击此格子时，擦除颜色
6. 每次进行上述的第 4 点或者第 5 点的操作时，显示“颜色岛“的总数量。一个颜色岛就是相连的所有已着色区域块，如下图中，总数量是 3。要求这个数字以美观的形式展示，1 秒后自动消失，具体样式和动画可以自行设计。
7. 敲击键盘 c 键时，对每一个已着色的格子随机产生另一个颜色，并且设计一个渐变动画，每个格子要从原来的颜色渐变成新颜色
