import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/calculate")
def calculate(operation: str, a: float, b: float):
    if operation == "add":
        return {"result": a + b}
    elif operation == "subtract":
        return {"result": a - b}
    elif operation == "multiply":
        return {"result": a * b}
    elif operation == "divide":
        if b == 0:
            raise HTTPException(status_code=400, detail="Cannot divide by zero")
        return {"result": a / b}
    else:
        raise HTTPException(status_code=400, detail="Invalid operation")

if __name__ == "__main__":
    uvicorn.run("filename:app", host="127.0.0.1", port=8000, reload=True)

