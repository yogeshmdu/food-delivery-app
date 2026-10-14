# Fresh to Home - Madurai Mertal Meats

Single-shop meat ordering app: customer app + shop admin panel + API.
No dependencies, only Node.js 18 or newer.

## Run locally
```
npm start
```
- Customer app: http://localhost:3000 (best viewed in a phone-sized window)
- Shop admin:   http://localhost:3000/admin (default key: admin123; change with ADMIN_KEY=yourkey npm start)

## Try it
1. Open the customer app, add items, checkout with a 10-digit phone number.
2. Open /admin in another tab: the order appears (with a beep). Accept it and move it along.
3. The customer's tracking screen updates by itself.

## Structure
- server.js: API + static server (data saved in data/db.json)
- public/index.html, app.js, style.css: customer app (installable on iOS/Android as a PWA)
- public/admin.html: shop owner panel (live orders, prices, stock)

## API
GET /api/menu, POST /api/orders, GET /api/orders?phone=, GET /api/orders/:id?phone=
Admin (header x-admin-key): GET /api/admin/orders, PATCH /api/admin/orders/:id, PATCH /api/admin/products/:id

## Next steps
React Native (Expo) app on the same API, PostgreSQL, OTP login, Razorpay, push notifications.

## Push to GitHub
```
git init && git add . && git commit -m "Fresh to Home app"
git branch -M main
git remote add origin https://github.com/yogeshmdu/food-delivery-app.git
git push -u origin main
```
