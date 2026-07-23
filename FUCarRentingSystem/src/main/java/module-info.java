module com.fucar {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.fucar.controller to javafx.fxml;
    exports com.fucar;
}