# 1. استخدام النسخة الرسمية فائقة النحافة والخالية من الأدوات الزائدة
FROM nginx:alpine-slim

# 2. نسخ ملفات موقعك
COPY . /usr/share/nginx/html

# 3. فتح المنفذ
EXPOSE 80