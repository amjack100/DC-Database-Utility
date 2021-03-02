import selenium


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import presence_of_element_located

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import os
import subprocess
import socket
from time import sleep
# https://www.selenium.dev/documentation/en/webdriver/browser_manipulation/

a_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

location = ("127.0.0.1", 5000)
result_of_check = a_socket.connect_ex(location)

if result_of_check == 0:
    subprocess.Popen('powershell stop-process -name python')
    sleep(2)

subprocess.Popen('powershell cd application;python ./app.py')


WEBDRIVER_EXE = os.path.join(os.getenv("dropbox"), r"Portables/msedgedriver.exe")



driver = webdriver.Edge(executable_path=WEBDRIVER_EXE)
sleep(1)
driver.get("http://localhost:5000/")

inp = driver.find_element_by_id('dir-input')
inp.send_keys("van wert")

sleep(1)
project_btns = driver.find_elements_by_name('goto-p')

project_btns[0].click()


