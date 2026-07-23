package com.fucar.controller;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.stage.Stage;

import java.io.IOException;

public class LoginController {

    @FXML private TextField     accountNameField;
    @FXML private PasswordField passwordField;
    @FXML private TextField     passwordVisible;
    @FXML private CheckBox      showPasswordCheck;
    @FXML private Label         lblError;

    @FXML
    public void initialize() {
        lblError.setText("");
        // Đồng bộ 2 field password (PasswordField ẩn ↔ TextField hiện)
        passwordField.textProperty()
                .bindBidirectional(passwordVisible.textProperty());
        // Enter trên passwordField = click Đăng nhập
        passwordField.setOnAction(e -> handleLogin());
        passwordVisible.setOnAction(e -> handleLogin());
    }

    @FXML
    private void handleShowPassword() {
        boolean show = showPasswordCheck.isSelected();
        passwordField.setVisible(!show);
        passwordField.setManaged(!show);
        passwordVisible.setVisible(show);
        passwordVisible.setManaged(show);
    }

    @FXML
    private void handleLogin() {
        String username = accountNameField.getText().trim();
        String password = showPasswordCheck.isSelected()
                ? passwordVisible.getText()
                : passwordField.getText();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (username.equals("admin") && password.equals("admin123")) {
            showAlert(Alert.AlertType.INFORMATION,
                    "Đăng nhập thành công! Chào Admin.");
        } else if (username.equals("customer") && password.equals("cust123")) {
            showAlert(Alert.AlertType.INFORMATION,
                    "Đăng nhập thành công! Chào Customer.");
        } else {
            showError("Sai tên tài khoản hoặc mật khẩu.");
        }
    }

    @FXML
    private void handleForgotPassword() {
        showAlert(Alert.AlertType.INFORMATION,
                "Chức năng đang phát triển.");
    }

    private void showError(String msg) {
        lblError.setText("⚠ " + msg);
    }

    private void showAlert(Alert.AlertType type, String msg) {
        new Alert(type, msg, ButtonType.OK).showAndWait();
    }
}
