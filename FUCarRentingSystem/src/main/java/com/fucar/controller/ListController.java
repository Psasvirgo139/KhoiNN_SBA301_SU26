package com.fucar.controller;

import com.fucar.model.Student;
import javafx.collections.*;
import javafx.fxml.*;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.stage.*;

public class ListController {

    @FXML private TableView<Student>           tableView;
    @FXML private TableColumn<Student,Integer> colId;
    @FXML private TableColumn<Student,String>  colName;
    @FXML private TableColumn<Student,Double>  colScore;
    @FXML private TableColumn<Student,String>  colGrade;
    @FXML private Button btnDetail;

    @FXML
    public void initialize() {
        // 1. Bind cột → thuộc tính Student
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colName.setCellValueFactory(new PropertyValueFactory<>("name"));
        colScore.setCellValueFactory(new PropertyValueFactory<>("score"));
        colGrade.setCellValueFactory(new PropertyValueFactory<>("grade"));

        // 2. Dữ liệu mẫu
        tableView.setItems(FXCollections.observableArrayList(
                new Student(1, "Nguyễn Văn An",  8.5),
                new Student(2, "Trần Thị Bình",  7.0),
                new Student(3, "Lê Văn Cường",   5.5),
                new Student(4, "Phạm Thị Dung",  4.0),
                new Student(5, "Hoàng Văn Em",   9.0)
        ));

        // 3. Bật nút khi có dòng được chọn
        btnDetail.disableProperty().bind(
                tableView.getSelectionModel().selectedItemProperty().isNull());

        // 4. Nhấp đúp = xem chi tiết
        tableView.setOnMouseClicked(e -> {
            if (e.getClickCount() == 2) handleViewDetail();
        });
    }

    @FXML
    private void handleViewDetail() {
        Student s = tableView.getSelectionModel().getSelectedItem();
        if (s == null) return;
        try {
            FXMLLoader loader = new FXMLLoader(
                    getClass().getResource("/com/fucar/detail-view.fxml"));
            Stage dialog = new Stage();
            dialog.setScene(new Scene(loader.load()));
            dialog.setTitle("Chi tiết sinh viên");
            dialog.initModality(Modality.APPLICATION_MODAL);
            dialog.initOwner(tableView.getScene().getWindow());

            // Truyền dữ liệu TRƯỚC khi show
            DetailController ctrl = loader.getController();
            ctrl.setStudent(s);

            dialog.showAndWait();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @FXML
    private void handleClose() {
        tableView.getScene().getWindow().hide();
    }
}