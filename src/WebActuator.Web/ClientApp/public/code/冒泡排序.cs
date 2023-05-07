using System;

int[] arr = { 5, 2, 8, 4, 1, 3, 9, 6, 7 };

Console.WriteLine("Original array: ");
BubbleSort.PrintArray(arr);

BubbleSort.BubbleSortArray(arr);
Console.WriteLine("Sorted array: ");
BubbleSort.PrintArray(arr);

public class BubbleSort {
    public static void BubbleSortArray(int[] arr) {
        int n = arr.Length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    public static void PrintArray(int[] arr) {
        foreach (int i in arr) {
            Console.WriteLine(i + " ");
        }
    }
}
