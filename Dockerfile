# 1. تحديد الصورة الأساسية
FROM node:20

# 2. تحديد مجلد العمل داخل حاوية Docker
WORKDIR /app

# 3. نسخ ملفات الحزم وتثبيتها
COPY package*.json ./
RUN npm install

# 4. نسخ باقي ملفات المشروع (التي يديرها Git)
COPY . .

# 5. تحديد الأمر لتشغيل التطبيق
CMD ["npm", "start"]