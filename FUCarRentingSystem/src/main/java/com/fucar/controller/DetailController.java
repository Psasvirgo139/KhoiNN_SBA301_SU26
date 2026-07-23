package com.fucar.controller;

import com.fucar.model.Student;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import javafx.stage.Stage;

public class DetailController {

    @FXML private Label lblId, lblName, lblScore, lblGrade;

    /** Gọi từ ListController TRƯỚC khi stage.show() */
    public void setStudent(Student s) {
        lblId.setText(String.valueOf(s.getId()));
        lblName.setText(s.getName());
        lblScore.setText(String.format("%.1f", s.getScore()));
        lblGrade.setText(s.getGrade());
    }

    @FXML
    private void handleClose() {
        ((Stage) lblId.getScene().getWindow()).close();
    }
}