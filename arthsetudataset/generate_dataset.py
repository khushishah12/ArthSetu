import random
import numpy as np
import pandas as pd
from faker import Faker

fake = Faker("en_IN")
random.seed(42)
np.random.seed(42)

NUM_USERS = 10000

personas = {
    "Student": 0.20,
    "Salaried": 0.35,
    "Freelancer": 0.20,
    "Business Owner": 0.15,
    "Gig Worker": 0.10,
}


def choose_persona():
    return random.choices(
        list(personas.keys()),
        weights=list(personas.values())
    )[0]


def clamp(value, low, high):
    return max(low, min(value, high))


def generate_user(user_id):

    persona = choose_persona()

    if persona == "Student":

        age = random.randint(18,24)
        income = random.randint(5000,25000)

        savings_rate = random.uniform(0.02,0.15)

        recharge_frequency = random.randint(8,12)

        recharge_amount = random.choice([199,239,299,399])

        electricity = random.randint(75,100)
        water = random.randint(75,100)
        internet = random.randint(80,100)

        late_bills = random.randint(0,3)

        upi = random.randint(120,300)

        wallet = random.randint(20,80)

        ecommerce = random.randint(2,12)

    elif persona=="Salaried":

        age=random.randint(23,45)

        income=random.randint(25000,90000)

        savings_rate=random.uniform(0.15,0.40)

        recharge_frequency=random.randint(10,12)

        recharge_amount=random.choice([299,399,499,599])

        electricity=random.randint(90,100)
        water=random.randint(90,100)
        internet=random.randint(90,100)

        late_bills=random.randint(0,1)

        upi=random.randint(100,250)

        wallet=random.randint(10,50)

        ecommerce=random.randint(4,15)

    elif persona=="Freelancer":

        age=random.randint(21,40)

        income=random.randint(15000,70000)

        savings_rate=random.uniform(0.08,0.30)

        recharge_frequency=random.randint(8,12)

        recharge_amount=random.choice([239,299,399])

        electricity=random.randint(75,100)
        water=random.randint(75,100)
        internet=random.randint(75,100)

        late_bills=random.randint(0,3)

        upi=random.randint(150,350)

        wallet=random.randint(20,90)

        ecommerce=random.randint(3,15)

    elif persona=="Business Owner":

        age=random.randint(28,60)

        income=random.randint(40000,120000)

        savings_rate=random.uniform(0.20,0.45)

        recharge_frequency=random.randint(10,12)

        recharge_amount=random.choice([399,499,599])

        electricity=random.randint(90,100)
        water=random.randint(90,100)
        internet=random.randint(90,100)

        late_bills=random.randint(0,2)

        upi=random.randint(250,500)

        wallet=random.randint(10,50)

        ecommerce=random.randint(6,20)

    else:

        age=random.randint(20,45)

        income=random.randint(10000,40000)

        savings_rate=random.uniform(0.05,0.18)

        recharge_frequency=random.randint(6,11)

        recharge_amount=random.choice([199,239,299])

        electricity=random.randint(70,95)
        water=random.randint(70,95)
        internet=random.randint(70,95)

        late_bills=random.randint(1,5)

        upi=random.randint(80,250)

        wallet=random.randint(20,100)

        ecommerce=random.randint(1,10)

    savings=int(income*savings_rate)

    expenses=income-savings-random.randint(500,3000)

    payment_consistency=(electricity+water+internet)/3

    digital_activity=upi+wallet+ecommerce

    expense_ratio=expenses/income

    savings_ratio=savings/income

    financial_discipline=(
        payment_consistency*0.5
        + savings_ratio*100*0.3
        + recharge_frequency*2
    )

    score=500

    score+=(payment_consistency-70)*2

    score+=recharge_frequency*4

    score+=savings_ratio*120

    score+=min(upi,300)*0.12

    score+=wallet*0.15

    score+=ecommerce*0.8

    score-=late_bills*18

    score-=expense_ratio*40

    score+=random.randint(-12,12)

    score=int(clamp(score,300,900))

    if score<550:
        category="Poor"
    elif score<650:
        category="Fair"
    elif score<750:
        category="Good"
    else:
        category="Excellent"

    city=random.choice(["Tier-1","Tier-2","Tier-3"])

    occupation=persona

    return {

        "user_id":user_id,

        "name":fake.name(),

        "age":age,

        "gender":random.choice(["Male","Female"]),

        "city_tier":city,

        "occupation":occupation,

        "monthly_income":income,

        "monthly_expenses":expenses,

        "monthly_savings":savings,

        "recharge_frequency":recharge_frequency,

        "average_recharge_amount":recharge_amount,

        "electricity_payment_rate":electricity,

        "water_payment_rate":water,

        "internet_payment_rate":internet,

        "late_bill_count":late_bills,

        "upi_transactions":upi,

        "wallet_transactions":wallet,

        "ecommerce_orders":ecommerce,

        "payment_consistency":round(payment_consistency,2),

        "digital_activity_score":digital_activity,

        "expense_ratio":round(expense_ratio,2),

        "savings_ratio":round(savings_ratio,2),

        "financial_discipline":round(financial_discipline,2),

        "credit_score":score,

        "credit_category":category

    }


dataset=[]

for i in range(NUM_USERS):

    dataset.append(generate_user(i+1))

df=pd.DataFrame(dataset)

df.to_csv("credit_dataset.csv",index=False)

print(df.head())

print()

print("Dataset Shape:",df.shape)

print()

print(df["credit_category"].value_counts())

print()

print("Saved Successfully -> credit_dataset.csv")
