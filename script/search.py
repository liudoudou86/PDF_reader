# -*- coding:utf-8 -*-
# Author:lz

import os
import subprocess
from tkinter import *

def search(executable_file):
    desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    # print(desktop_path)
    for root, dirs, files in os.walk(desktop_path):
        for name in files:
            file_path = os.path.join(root, name)
            if executable_file in name:
                # print(os.path.split(file_path))
                # os.popen(file_path)
                proc = subprocess.Popen(
                    file_path,
                    shell=True,
                    bufsize=0,
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.STDOUT, 
                    stdin=subprocess.PIPE # 重定向输入值
                )
                proc.stdin.close() # 既然没有命令行窗口，那就关闭输入
                proc.wait()
                proc.stdout.close()

def enter_key(event=None):
    executable_file = e.get()
    open_file = search(executable_file)
    root.destroy()
    # print(e.get())

root = Tk()
root.geometry("+330+120")
root.overrideredirect(True)
e = StringVar()
entry = Entry(root, bg="black", fg="white", insertbackground='blue', validate='focusin', font=('微软雅黑', 30), textvariable=e, width=30)
entry.pack()
entry.bind('<Return>', enter_key) # 监听Enter键，读取内容
entry.bind('<Alt-z>', lambda x: root.destroy()) # 监听Alt+z键，销毁窗口
# root.title('快速启动工具')
root.mainloop() # 窗口循环