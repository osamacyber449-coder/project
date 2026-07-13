# 1. استخدام نسخة Nginx الآمنة والخالية تماماً من ثغرات busybox
FROM cgr.dev/chainguard/nginx:latest

# 2. نسخ ملفات موقعك إلى المجلد المخصص لها في هذه النسخة
COPY . /var/lib/nginx/html/