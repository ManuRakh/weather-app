# Before all.
1. Fill .env file. Each service has it's own env.example files. Indicating required rows to be filled.
2. go to auth-service <br/>
    and type npm i <br/>
    <br/> 
    next type npm run seed
    <br/> typeorm will create table and seed data.
    <br> After seeding for search purposes you can use that datas
    [<br>
            { city: 'New York', date: '2024-08-20', temperature: 29, condition: 'Sunny' },<br>
            { city: 'Los Angeles', date: '2024-08-20', temperature: 25, condition: 'Cloudy' },<br>
            { city: 'Chicago', date: '2024-08-20', temperature: 22, condition: 'Rainy' },<br>
            { city: 'Houston', date: '2024-08-20', temperature: 30, condition: 'Sunny' },<br>
            { city: 'Phoenix', date: '2024-08-20', temperature: 35, condition: 'Hot' },<br>
            { city: 'Philadelphia', date: '2024-08-20', temperature: 24, condition: 'Windy' },<br>
            { city: 'San Antonio', date: '2024-08-20', temperature: 28, condition: 'Sunny' },<br>
            { city: 'San Diego', date: '2024-08-20', temperature: 26, condition: 'Cloudy' },<br>
            { city: 'Dallas', date: '2024-08-20', temperature: 31, condition: 'Hot' },<br>
            { city: 'San Jose', date: '2024-08-20', temperature: 27, condition: 'Sunny' },<br>
        ];<br>
3. Do same with weather-service
4. Go to api-gateway service and type npm i.
5. Go to notification service and type npm i.