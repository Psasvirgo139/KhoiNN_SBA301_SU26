package com.fucar.model;

public class Student {
    private int    id;
    private String name;
    private double score;
    private String grade;

    public Student(int id, String name, double score) {
        this.id    = id;
        this.name  = name;
        this.score = score;
        this.grade = calcGrade(score);
    }

    public static String calcGrade(double s) {
        if (s >= 8.5) return "Xuất sắc";
        if (s >= 7.0) return "Giỏi";
        if (s >= 5.5) return "Khá";
        if (s >= 4.0) return "Trung bình";
        return "Yếu";
    }

    public int    getId()    { return id; }
    public String getName()  { return name; }
    public double getScore() { return score; }
    public String getGrade() { return grade; }
}