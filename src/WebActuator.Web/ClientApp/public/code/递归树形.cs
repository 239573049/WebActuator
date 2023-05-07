using System;

int depth = 5; // 树的深度
int width = 2; // 每个节点的子节点数

// 生成树
var root = Program.GenerateTree(depth, width);

// 打印树
Program.PrintTree(root, 0);


public class Program
{
    // 生成树
    public static Node GenerateTree(int depth, int width)
    {
        if (depth == 0)
        {
            return null;
        }

        Node node = new Node();

        for (int i = 0; i < width; i++)
        {
            node.Children.Add(GenerateTree(depth - 1, width));
        }

        return node;
    }

    // 打印树
    public static void PrintTree(Node node, int level)
    {
        if (node == null)
        {
            return;
        }

        Console.WriteLine(new string('-', level) + node.Value);

        foreach (Node child in node.Children)
        {
            PrintTree(child, level + 1);
        }
    }
}

// 节点类
public class Node
{
    public string Value { get; set; }
    public List<Node> Children { get; set; }

    public Node()
    {
        Value = Guid.NewGuid().ToString();
        Children = new List<Node>();
    }
}
