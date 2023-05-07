
using System;

Rectangle r = new Rectangle();
r.Acceptdetails();
r.Display();
Console.ReadLine();

class Rectangle
{
    // 成员变量
    double length;
    double width;
    public void Acceptdetails()
    {
        length = 4.5;
        width = 3.5;
    }
    public double GetArea()
    {
        return length * width;
    }
    public void Display()
    {
        Console.WriteLine("Length: {0}", length);
        Console.WriteLine("Width: {0}", width);
        Console.WriteLine("Area: {0}", GetArea());
    }
}