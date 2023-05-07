class Calculator
{
    public int Add(int num1, int num2)
    {
        return num1 + num2;
    }

    public int Subtract(int num1, int num2)
    {
        return num1 - num2;
    }

    public int Multiply(int num1, int num2)
    {
        return num1 * num2;
    }

    public int Divide(int num1, int num2)
    {
        return num1 / num2;
    }
}

Calculator calc = new Calculator();
int result = calc.Add(5, 10);
Console.WriteLine($"5 + 10 = {result}");
