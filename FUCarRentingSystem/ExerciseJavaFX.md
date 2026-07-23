# Exercises - JavaFX
---

## PHẦN 1 — CẤU TRÚC THƯ MỤC DỰ ÁN

```
FUCarRentingSystem/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── com/fucar/
        │       ├── MainApp.java                  ← Entry point, load FXML đầu tiên
        │       ├── model/
        │       │   ├── Car.java                  ← NC1, NC3
        │       │   ├── Customer.java             ← NC2, NC3
        │       │   └── Student.java              ← TH2
        │       └── controller/
        │           ├── LoginController.java      ← TH1
        │           ├── ListController.java       ← TH2
        │           ├── DetailController.java     ← TH2
        │           ├── CarDialogController.java  ← NC1
        │           ├── CustomerController.java   ← NC2
        │           ├── RentalController.java     ← NC3
        │           ├── ReportController.java     ← NC4
        │           └── MainController.java       ← NC5
        └── resources/
            └── com/fucar/
                ├── login-view.fxml               ← TH1
                ├── list-view.fxml                ← TH2
                ├── detail-view.fxml              ← TH2
                ├── car-dialog.fxml               ← NC1
                ├── customer-view.fxml            ← NC2
                ├── rental-view.fxml              ← NC3
                ├── report-view.fxml              ← NC4
                ├── main-view.fxml                ← NC5
                └── style.css                     ← TH3, NC5
```

> **Quy tắc bắt buộc:** File `.fxml` phải nằm trong `resources/` ở **cùng đường dẫn package** với Controller.  
> Ví dụ: `LoginController.java` ở `com/fucar/controller/` thì `login-view.fxml` ở `resources/com/fucar/`.

---

## PHẦN 2 — CÀI ĐẶT & CẤU HÌNH

### 2.1 Thêm JavaFX vào pom.xml

**Tạo file:** `pom.xml` ở thư mục gốc project (IntelliJ tự tạo khi chọn Maven project).

```xml
<dependencies>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-controls</artifactId>
        <version>21</version>
    </dependency>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-fxml</artifactId>
        <version>21</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-maven-plugin</artifactId>
            <version>0.0.8</version>
            <configuration>
                <mainClass>com.fucar.MainApp</mainClass>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**✅ Checklist sau bước này:**
- [ ] IntelliJ hiển thị biểu tượng Maven ở góc phải → click "Reload"
- [ ] Không có lỗi đỏ ở `pom.xml`
- [ ] Thư mục `External Libraries` có `javafx-controls` và `javafx-fxml`

---

### 2.2 Cài Scene Builder và kết nối IntelliJ

**Bước 1:** Tải Scene Builder tại https://gluonhq.com/products/scene-builder/ — chọn bản 21.

**Bước 2:** Cài đặt → ghi nhớ đường dẫn cài (VD: `C:\Program Files\SceneBuilder\SceneBuilder.exe`).

**Bước 3:** Trong IntelliJ: `File` → `Settings` → `Languages & Frameworks` → `JavaFX`  
→ Ô **Path to SceneBuilder** → chọn file `SceneBuilder.exe` → **OK**.

**✅ Checklist sau bước này:**
- [ ] Chuột phải vào bất kỳ file `.fxml` → menu có mục **"Open in SceneBuilder"**
- [ ] SceneBuilder mở được và không báo lỗi

---

### 2.3 Tạo cấu trúc package trong IntelliJ

**Bước 1:** Chuột phải `src/main/java` → `New` → `Package` → nhập `com.fucar.model` → Enter.

**Bước 2:** Chuột phải `src/main/java` → `New` → `Package` → nhập `com.fucar.controller` → Enter.

**Bước 3:** Chuột phải `src/main/resources` → `New` → `Directory` → nhập `com/fucar` → Enter.

**✅ Checklist sau bước này:**
- [ ] Cây thư mục có `com/fucar/model/` trong java
- [ ] Cây thư mục có `com/fucar/controller/` trong java
- [ ] Cây thư mục có `com/fucar/` trong resources

---

## PHẦN 3 — KIẾN THỨC NỀN FXML

### 3 thành phần cốt lõi

| Thành phần | File | Vai trò |
|-----------|------|---------|
| **View** | `*.fxml` | Khai báo giao diện (XML), chỉnh sửa bằng Scene Builder |
| **Controller** | `*Controller.java` | Xử lý logic, events, validation |
| **Entry** | `MainApp.java` | Load FXML → tạo Scene → gán vào Stage |

### Liên kết View ↔ Controller

```
FXML                              Controller
────────────────────────────────────────────────────
fx:controller="com.fucar..."  →  class tương ứng
fx:id="tfName"                →  @FXML TextField tfName;
onAction="#handleSave"        →  @FXML void handleSave()
```

---

## PHẦN 4 — BÀI TH1: FORM ĐĂNG NHẬP

### Mục tiêu
Tạo `login-view.fxml` + `LoginController.java`. Form login với CheckBox hiện mật khẩu, validate, Alert.

---

### BƯỚC 1 — Tạo file LoginController.java

**Thao tác:**  
Chuột phải package `com.fucar.controller` → `New` → `Java Class` → nhập `LoginController` → Enter.

**✅ Kiểm tra:**
- [ ] File `LoginController.java` xuất hiện trong `controller/`
- [ ] Đầu file có `package com.fucar.controller;`

---

### BƯỚC 2 — Tạo file login-view.fxml

**Thao tác:**  
Chuột phải folder `resources/com/fucar/` → `New` → `File` → nhập `login-view.fxml` → Enter.

Dán nội dung sau:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<AnchorPane xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="com.fucar.controller.LoginController"
            style="-fx-background-color: #1A237E;"
            prefWidth="500" prefHeight="400">

    <VBox style="-fx-background-color: white; -fx-background-radius: 10;
                 -fx-effect: dropshadow(gaussian,rgba(0,0,0,0.3),20,0,0,5);"
          prefWidth="380" spacing="14"
          AnchorPane.topAnchor="50" AnchorPane.bottomAnchor="50"
          AnchorPane.leftAnchor="60" AnchorPane.rightAnchor="60">
        <padding><Insets top="40" right="40" bottom="40" left="40"/></padding>

        <Label text="ĐĂNG NHẬP HỆ THỐNG"
               style="-fx-font-size:20px;-fx-font-weight:bold;-fx-text-fill:#1F4E79;"
               maxWidth="Infinity" alignment="CENTER"/>
        <Label text="FUCarRentingSystem"
               style="-fx-font-size:13px;-fx-text-fill:#757575;"
               maxWidth="Infinity" alignment="CENTER"/>

        <Label text="Tên tài khoản:"/>
        <TextField fx:id="accountNameField" promptText="Nhập tên tài khoản"/>

        <Label text="Mật khẩu:"/>
        <PasswordField fx:id="passwordField" promptText="Nhập mật khẩu"/>
        <TextField fx:id="passwordVisible" promptText="Nhập mật khẩu"
                   managed="false" visible="false"/>

        <CheckBox fx:id="showPasswordCheck" text="Hiện mật khẩu"
                  onAction="#handleShowPassword"/>

        <Button fx:id="loginBtn" text="ĐĂNG NHẬP"
                maxWidth="Infinity" defaultButton="true"
                onAction="#handleLogin"
                style="-fx-background-color:#1565C0;-fx-text-fill:white;
                       -fx-font-weight:bold;-fx-font-size:14px;-fx-cursor:hand;"/>

        <Hyperlink text="Quên mật khẩu?" onAction="#handleForgotPassword"
                   style="-fx-text-fill:#1565C0;" alignment="CENTER_RIGHT"
                   maxWidth="Infinity"/>

        <Label fx:id="lblError" wrapText="true"
               style="-fx-text-fill:red;-fx-font-size:12px;"/>
    </VBox>
</AnchorPane>
```

**✅ Kiểm tra:**
- [ ] File `login-view.fxml` có trong `resources/com/fucar/`
- [ ] Chuột phải file → `Open in SceneBuilder` → SceneBuilder hiển thị form card trắng
- [ ] Trong SceneBuilder: click VBox → tab **Code** → thấy `fx:controller` = `com.fucar.controller.LoginController`

---

### BƯỚC 3 — Viết LoginController.java

Mở `LoginController.java`, thay thế toàn bộ nội dung:

```java
package com.fucar.controller;

import javafx.fxml.FXML;
import javafx.scene.control.*;

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
```

**✅ Kiểm tra:**
- [ ] Không có gạch đỏ lỗi compile trong file
- [ ] Tên biến `@FXML` khớp chính xác với `fx:id` trong FXML (case-sensitive)
- [ ] Tên method khớp với `onAction` trong FXML

---

### BƯỚC 4 — Tạo MainApp.java và load FXML

**Thao tác:**  
Chuột phải package `com.fucar` → `New` → `Java Class` → nhập `MainApp` → Enter.

```java
package com.fucar;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import java.io.IOException;

public class MainApp extends Application {

    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader loader = new FXMLLoader(
            MainApp.class.getResource("/com/fucar/login-view.fxml"));
        Scene scene = new Scene(loader.load(), 500, 400);
        stage.setTitle("FUCarRentingSystem v1.0");
        stage.setResizable(false);
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

**✅ Kiểm tra sau bước này:**
- [ ] Chạy `MainApp.main()` → cửa sổ 500×400 xuất hiện
- [ ] Form card trắng trên nền xanh đậm hiển thị đúng
- [ ] Nhập `admin` / `admin123` → Alert "Đăng nhập thành công!"
- [ ] Bỏ trống → Alert "Vui lòng nhập đầy đủ"
- [ ] Nhập sai → Label đỏ "Sai tên tài khoản"
- [ ] CheckBox "Hiện mật khẩu" ẩn/hiện password đúng
- [ ] Nhấn Enter trên PasswordField = click nút Đăng nhập

---

## PHẦN 5 — BÀI TH2: HAI MÀN HÌNH + TRUYỀN DỮ LIỆU

### Mục tiêu
`list-view.fxml` (TableView) → click "Xem chi tiết" → mở `detail-view.fxml` modal, truyền object Student.

---

### BƯỚC 1 — Tạo class Student.java

**Thao tác:** Chuột phải `com.fucar.model` → `New` → `Java Class` → `Student`.

```java
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
```

**✅ Kiểm tra:**
- [ ] File nằm trong `com/fucar/model/`
- [ ] Không có lỗi compile
- [ ] Có đủ 4 getter (bắt buộc để `PropertyValueFactory` hoạt động)

---

### BƯỚC 2 — Tạo list-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `list-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="10" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.ListController"
      prefWidth="600" prefHeight="420">
    <padding><Insets top="15" right="15" bottom="15" left="15"/></padding>

    <Label text="DANH SÁCH SINH VIÊN"
           style="-fx-font-size:18px;-fx-font-weight:bold;-fx-text-fill:#1F4E79;"/>

    <TableView fx:id="tableView" VBox.vgrow="ALWAYS">
        <columns>
            <TableColumn fx:id="colId"    text="Mã SV"    prefWidth="80"/>
            <TableColumn fx:id="colName"  text="Họ tên"   prefWidth="200"/>
            <TableColumn fx:id="colScore" text="Điểm"     prefWidth="80"/>
            <TableColumn fx:id="colGrade" text="Xếp loại" prefWidth="120"/>
        </columns>
        <placeholder><Label text="Không có dữ liệu"/></placeholder>
    </TableView>

    <HBox spacing="8" alignment="CENTER_RIGHT">
        <Button fx:id="btnDetail" text="Xem chi tiết"
                onAction="#handleViewDetail" disable="true"
                style="-fx-background-color:#1565C0;-fx-text-fill:white;-fx-cursor:hand;"/>
        <Button text="Đóng" onAction="#handleClose"/>
    </HBox>
</VBox>
```

**✅ Kiểm tra:**
- [ ] Mở trong SceneBuilder: thấy TableView với 4 cột
- [ ] `fx:controller` = `com.fucar.controller.ListController`
- [ ] `btnDetail` có `disable="true"` (mờ khi chưa chọn dòng)

---

### BƯỚC 3 — Tạo ListController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `ListController`.

```java
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
```

**✅ Kiểm tra:**
- [ ] `PropertyValueFactory` tên khớp getter: `"id"` → `getId()`, `"name"` → `getName()`...
- [ ] `btnDetail.disableProperty().bind(...)` — không cần set thủ công

---

### BƯỚC 4 — Tạo detail-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `detail-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="14" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.DetailController"
      prefWidth="320" prefHeight="260">
    <padding><Insets top="30" right="30" bottom="30" left="30"/></padding>

    <Label text="CHI TIẾT SINH VIÊN"
           style="-fx-font-size:16px;-fx-font-weight:bold;-fx-text-fill:#1F4E79;"
           maxWidth="Infinity" alignment="CENTER"/>

    <GridPane hgap="12" vgap="10">
        <Label text="Mã SV:"    GridPane.columnIndex="0" GridPane.rowIndex="0"
               style="-fx-font-weight:bold;"/>
        <Label fx:id="lblId"    GridPane.columnIndex="1" GridPane.rowIndex="0"/>

        <Label text="Họ tên:"   GridPane.columnIndex="0" GridPane.rowIndex="1"
               style="-fx-font-weight:bold;"/>
        <Label fx:id="lblName"  GridPane.columnIndex="1" GridPane.rowIndex="1"/>

        <Label text="Điểm:"     GridPane.columnIndex="0" GridPane.rowIndex="2"
               style="-fx-font-weight:bold;"/>
        <Label fx:id="lblScore" GridPane.columnIndex="1" GridPane.rowIndex="2"/>

        <Label text="Xếp loại:" GridPane.columnIndex="0" GridPane.rowIndex="3"
               style="-fx-font-weight:bold;"/>
        <Label fx:id="lblGrade" GridPane.columnIndex="1" GridPane.rowIndex="3"/>

        <columnConstraints>
            <ColumnConstraints minWidth="80"/>
            <ColumnConstraints hgrow="ALWAYS"/>
        </columnConstraints>
    </GridPane>

    <Button text="Đóng" maxWidth="Infinity" onAction="#handleClose"
            style="-fx-background-color:#757575;-fx-text-fill:white;-fx-cursor:hand;"/>
</VBox>
```

**✅ Kiểm tra:**
- [ ] File có 4 `fx:id`: `lblId`, `lblName`, `lblScore`, `lblGrade`
- [ ] `fx:controller` trỏ đúng `com.fucar.controller.DetailController`

---

### BƯỚC 5 — Tạo DetailController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `DetailController`.

```java
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
```

**✅ Kiểm tra sau toàn bộ TH2:**
- [ ] Chạy app → TableView hiển thị 5 dòng
- [ ] Chưa chọn dòng → nút "Xem chi tiết" mờ (disable)
- [ ] Click chọn dòng → nút sáng lên
- [ ] Click "Xem chi tiết" → cửa sổ modal mở, dữ liệu đúng với dòng đã chọn
- [ ] Cửa sổ cha không click được khi modal đang mở
- [ ] Nhấp đúp vào dòng cũng mở modal
- [ ] Nút "Đóng" trong modal đóng được

## Yêu cầu viết code để hiển thị trang list-view.fxml, sau khi login thành công 
## Cần hiệu chỉnh Login Controller

## Cấu hình base model


## PHẦN 6 — BÀI TH3: CSS THEME

### Mục tiêu
Tạo `style.css`, apply vào toàn app, highlight row chọn, badge trạng thái.

---

### BƯỚC 1 — Tạo file style.css

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `style.css`.

```css
/* === Nền chung === */
.root {
    -fx-background-color: #F5F9FF;
    -fx-font-family: "Segoe UI", Arial, sans-serif;
}

/* === Buttons === */
.btn-primary {
    -fx-background-color: #1565C0;
    -fx-text-fill: white;
    -fx-font-weight: bold;
    -fx-cursor: hand;
    -fx-background-radius: 6;
    -fx-padding: 8 18 8 18;
}
.btn-primary:hover   { -fx-background-color: #1976D2; }
.btn-primary:pressed { -fx-background-color: #0D47A1; }

.btn-danger {
    -fx-background-color: #C62828;
    -fx-text-fill: white;
    -fx-font-weight: bold;
    -fx-cursor: hand;
    -fx-background-radius: 6;
}
.btn-danger:hover { -fx-background-color: #D32F2F; }

.btn-success {
    -fx-background-color: #2E7D32;
    -fx-text-fill: white;
    -fx-font-weight: bold;
    -fx-cursor: hand;
    -fx-background-radius: 6;
}

/* === Field lỗi === */
.field-error {
    -fx-border-color: #C62828;
    -fx-border-width: 2;
    -fx-border-radius: 4;
}
.label-error {
    -fx-text-fill: #C62828;
    -fx-font-size: 11px;
}

/* === TableView === */
.table-view .column-header {
    -fx-background-color: #1F4E79;
}
.table-view .column-header .label {
    -fx-text-fill: white;
    -fx-font-weight: bold;
}
.table-view .table-row-cell:odd  { -fx-background-color: #FFFFFF; }
.table-view .table-row-cell:even { -fx-background-color: #E3F2FD; }
.table-view .table-row-cell:hover    { -fx-background-color: #BBDEFB; }
.table-view .table-row-cell:selected {
    -fx-background-color: #1565C0;
    -fx-text-fill: white;
}

/* === Card === */
.card {
    -fx-background-color: white;
    -fx-background-radius: 8;
    -fx-effect: dropshadow(gaussian,rgba(0,0,0,0.12),8,0,0,2);
    -fx-padding: 16;
}

/* === Tiêu đề màn hình === */
.screen-title {
    -fx-font-size: 20px;
    -fx-font-weight: bold;
    -fx-text-fill: #1F4E79;
}

/* === Tooltip === */
.tooltip {
    -fx-background-color: #37474F;
    -fx-text-fill: white;
    -fx-font-size: 12px;
    -fx-background-radius: 4;
}

/* === Accordion === */
.titled-pane > .title {
    -fx-background-color: #1F4E79;
    -fx-text-fill: white;
    -fx-font-weight: bold;
}
.titled-pane > .title:hover { -fx-background-color: #2E75B6; }
.titled-pane > .content     { -fx-background-color: #F5F9FF; }
```

**✅ Kiểm tra:**
- [ ] File tồn tại ở `resources/com/fucar/style.css`
- [ ] Không có lỗi cú pháp (IntelliJ highlight CSS hợp lệ)

---

### BƯỚC 2 — Khai báo CSS trong FXML

Thêm `stylesheets="@style.css"` vào **root element** của từng FXML:

```xml
<!-- Trong login-view.fxml: -->
<AnchorPane ... stylesheets="@style.css">

<!-- Trong list-view.fxml: -->
<VBox ... stylesheets="@style.css">
```

> **Lưu ý:** Dấu `@` nghĩa là tìm file CSS cùng thư mục với file FXML.

**✅ Kiểm tra:**
- [ ] Mở Scene Builder → tab **Properties** của root node → mục **Stylesheets** có `@style.css`

---

### BƯỚC 3 — Apply styleClass trong FXML

Thêm `styleClass` cho các button trong `list-view.fxml`:

```xml
<Button fx:id="btnDetail" text="Xem chi tiết"
        styleClass="btn-primary" onAction="#handleViewDetail" disable="true"/>
<Button text="Đóng" styleClass="btn-danger" onAction="#handleClose"/>
```

**✅ Kiểm tra:**
- [ ] Trong Scene Builder: click button → Inspector → **Style Class** có `btn-primary`

---

### BƯỚC 4 — Load CSS trong MainApp (toàn ứng dụng)

Cách load CSS qua code thay vì FXML (áp dụng cho toàn Scene):

```java
Scene scene = new Scene(loader.load(), 500, 400);
scene.getStylesheets().add(
    MainApp.class.getResource("/com/fucar/style.css").toExternalForm()
);
```

**✅ Kiểm tra sau toàn bộ TH3:**
- [ ] Nền app màu xanh nhạt #F5F9FF
- [ ] TableView header màu xanh đậm, chữ trắng
- [ ] Row xen kẽ trắng / xanh nhạt
- [ ] Row được chọn: nền xanh đậm, chữ trắng
- [ ] Button "Xem chi tiết" có viền bo tròn, màu xanh

---

## PHẦN 7 — BÀI NC1: DIALOG CRUD XE

### Mục tiêu
Stage modal thêm/sửa xe với `Spinner`, `ComboBox`, `TextArea`, `RadioButton`.  
Validation hiển thị lỗi **inline** ngay dưới từng field (không Alert toàn cục).

---

### BƯỚC 1 — Tạo class Car.java

**Thao tác:** Chuột phải `com.fucar.model` → `New` → `Java Class` → `Car`.

```java
package com.fucar.model;

import java.time.LocalDate;

public class Car {
    private String    carId, carName, color, producer, status, description;
    private int       modelYear, capacity;
    private double    rentPrice;
    private LocalDate importDate;

    public Car() {}

    // Getters & Setters (IntelliJ: Alt+Insert → Getter and Setter → chọn All)
    public String    getCarId()      { return carId; }
    public void      setCarId(String v)      { carId = v; }
    public String    getCarName()    { return carName; }
    public void      setCarName(String v)    { carName = v; }
    public String    getColor()      { return color; }
    public void      setColor(String v)      { color = v; }
    public String    getProducer()   { return producer; }
    public void      setProducer(String v)   { producer = v; }
    public String    getStatus()     { return status; }
    public void      setStatus(String v)     { status = v; }
    public String    getDescription(){ return description; }
    public void      setDescription(String v){ description = v; }
    public int       getModelYear()  { return modelYear; }
    public void      setModelYear(int v)     { modelYear = v; }
    public int       getCapacity()   { return capacity; }
    public void      setCapacity(int v)      { capacity = v; }
    public double    getRentPrice()  { return rentPrice; }
    public void      setRentPrice(double v)  { rentPrice = v; }
    public LocalDate getImportDate() { return importDate; }
    public void      setImportDate(LocalDate v){ importDate = v; }
}
```

**✅ Kiểm tra:**
- [ ] File `Car.java` trong `com/fucar/model/`
- [ ] Có đủ getter/setter cho tất cả 10 trường

---

### BƯỚC 2 — Tạo car-dialog.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `car-dialog.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="0" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.CarDialogController"
      stylesheets="@style.css"
      prefWidth="600" prefHeight="560">
    <padding><Insets top="20" right="30" bottom="20" left="30"/></padding>

    <Label fx:id="lblTitle" text="Thêm thông tin xe"
           styleClass="screen-title"/>

    <ScrollPane fitToWidth="true" VBox.vgrow="ALWAYS"
                style="-fx-border-color:transparent;-fx-background-color:transparent;">
        <GridPane hgap="12" vgap="4">
            <padding><Insets top="14" bottom="14"/></padding>

            <!-- Mã xe -->
            <Label text="Mã xe:"         GridPane.columnIndex="0" GridPane.rowIndex="0"/>
            <TextField fx:id="tfCarId"   GridPane.columnIndex="1" GridPane.rowIndex="0"
                       editable="false"  text="Tự động tạo"
                       style="-fx-background-color:#EEEEEE;"/>

            <!-- Tên xe -->
            <Label text="Tên xe *:"      GridPane.columnIndex="0" GridPane.rowIndex="2"/>
            <TextField fx:id="tfCarName" GridPane.columnIndex="1" GridPane.rowIndex="2"
                       promptText="VD: Toyota Camry"/>
            <Label fx:id="errCarName"    GridPane.columnIndex="1" GridPane.rowIndex="3"
                   styleClass="label-error"/>

            <!-- Năm SX -->
            <Label text="Năm SX *:"           GridPane.columnIndex="0" GridPane.rowIndex="4"/>
            <Spinner fx:id="spinnerYear"      GridPane.columnIndex="1" GridPane.rowIndex="4"
                     editable="true" prefWidth="150"/>

            <!-- Màu sắc -->
            <Label text="Màu sắc:"            GridPane.columnIndex="0" GridPane.rowIndex="6"/>
            <ComboBox fx:id="cbColor"         GridPane.columnIndex="1" GridPane.rowIndex="6"
                      maxWidth="Infinity"/>

            <!-- Số chỗ -->
            <Label text="Số chỗ *:"           GridPane.columnIndex="0" GridPane.rowIndex="8"/>
            <Spinner fx:id="spinnerCapacity"  GridPane.columnIndex="1" GridPane.rowIndex="8"
                     prefWidth="150"/>

            <!-- Giá thuê -->
            <Label text="Giá thuê/ngày *:"    GridPane.columnIndex="0" GridPane.rowIndex="10"/>
            <TextField fx:id="tfRentPrice"    GridPane.columnIndex="1" GridPane.rowIndex="10"
                       promptText="VD: 500000"/>
            <Label fx:id="errRentPrice"       GridPane.columnIndex="1" GridPane.rowIndex="11"
                   styleClass="label-error"/>

            <!-- Ngày nhập -->
            <Label text="Ngày nhập *:"        GridPane.columnIndex="0" GridPane.rowIndex="12"/>
            <DatePicker fx:id="dpImport"      GridPane.columnIndex="1" GridPane.rowIndex="12"/>
            <Label fx:id="errImport"          GridPane.columnIndex="1" GridPane.rowIndex="13"
                   styleClass="label-error"/>

            <!-- Nhà SX -->
            <Label text="Nhà SX *:"           GridPane.columnIndex="0" GridPane.rowIndex="14"/>
            <ComboBox fx:id="cbProducer"      GridPane.columnIndex="1" GridPane.rowIndex="14"
                      maxWidth="Infinity" promptText="Chọn nhà sản xuất"/>
            <Label fx:id="errProducer"        GridPane.columnIndex="1" GridPane.rowIndex="15"
                   styleClass="label-error"/>

            <!-- Mô tả -->
            <Label text="Mô tả:"              GridPane.columnIndex="0" GridPane.rowIndex="16"/>
            <TextArea fx:id="taDesc"          GridPane.columnIndex="1" GridPane.rowIndex="16"
                      prefRowCount="3" promptText="Mô tả thêm về xe..."/>

            <!-- Trạng thái -->
            <Label text="Trạng thái:"         GridPane.columnIndex="0" GridPane.rowIndex="18"/>
            <HBox spacing="12"                GridPane.columnIndex="1" GridPane.rowIndex="18">
                <RadioButton fx:id="rbAvailable"   text="Có sẵn"/>
                <RadioButton fx:id="rbRenting"     text="Đang cho thuê"/>
                <RadioButton fx:id="rbMaintenance" text="Bảo dưỡng"/>
            </HBox>

            <ColumnConstraints minWidth="130" maxWidth="140"/>
            <ColumnConstraints hgrow="ALWAYS"/>
        </GridPane>
    </ScrollPane>

    <HBox spacing="10" alignment="CENTER_RIGHT">
        <padding><Insets top="12"/></padding>
        <Button text="HỦY" onAction="#handleCancel"
                style="-fx-background-color:#757575;-fx-text-fill:white;-fx-cursor:hand;"/>
        <Button text="LƯU" onAction="#handleSave" styleClass="btn-primary"
                defaultButton="true"/>
    </HBox>
</VBox>
```

**✅ Kiểm tra:**
- [ ] Mở Scene Builder → thấy form cuộn được
- [ ] Mỗi field quan trọng có Label lỗi ngay bên dưới (`errCarName`, `errRentPrice`...)
- [ ] `fx:id` của Spinner: `spinnerYear`, `spinnerCapacity`

---

### BƯỚC 3 — Tạo CarDialogController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `CarDialogController`.

```java
package com.fucar.controller;

import com.fucar.model.Car;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.stage.Stage;
import java.time.LocalDate;

public class CarDialogController {

    @FXML private Label    lblTitle;
    @FXML private TextField tfCarId, tfCarName, tfRentPrice;
    @FXML private Spinner<Integer> spinnerYear, spinnerCapacity;
    @FXML private ComboBox<String> cbColor, cbProducer;
    @FXML private DatePicker dpImport;
    @FXML private TextArea   taDesc;
    @FXML private RadioButton rbAvailable, rbRenting, rbMaintenance;
    @FXML private Label errCarName, errRentPrice, errImport, errProducer;

    private ToggleGroup statusGroup;
    private boolean     isEditMode = false;

    @FXML
    public void initialize() {
        // Spinner năm SX: 1990–2030, mặc định năm nay
        spinnerYear.setValueFactory(
            new SpinnerValueFactory.IntegerSpinnerValueFactory(
                1990, 2030, LocalDate.now().getYear()));

        // Spinner số chỗ: 2–16
        spinnerCapacity.setValueFactory(
            new SpinnerValueFactory.IntegerSpinnerValueFactory(2, 16, 4));

        // Màu sắc
        cbColor.getItems().addAll("Trắng","Đen","Bạc","Đỏ","Xanh","Vàng","Khác");
        cbColor.setValue("Trắng");

        // Nhà sản xuất
        cbProducer.getItems().addAll("Toyota","Honda","Ford","VinFast","Mazda");

        // ToggleGroup trạng thái — mặc định "Có sẵn"
        statusGroup = new ToggleGroup();
        rbAvailable.setToggleGroup(statusGroup);
        rbRenting.setToggleGroup(statusGroup);
        rbMaintenance.setToggleGroup(statusGroup);
        rbAvailable.setSelected(true);

        // Chỉ cho nhập số vào giá thuê
        tfRentPrice.textProperty().addListener((obs, old, newVal) -> {
            if (!newVal.matches("\\d*\\.?\\d*")) tfRentPrice.setText(old);
        });

        // Xóa lỗi khi người dùng bắt đầu nhập lại
        tfCarName.textProperty().addListener((o,ov,nv) -> errCarName.setText(""));
        tfRentPrice.textProperty().addListener((o,ov,nv) -> errRentPrice.setText(""));
        dpImport.valueProperty().addListener((o,ov,nv) -> errImport.setText(""));
        cbProducer.valueProperty().addListener((o,ov,nv) -> errProducer.setText(""));
    }

    /** Gọi từ màn hình cha để chuyển sang chế độ Edit */
    public void setEditMode(Car car) {
        isEditMode = true;
        lblTitle.setText("Chỉnh sửa thông tin xe");
        tfCarId.setText(car.getCarId());
        tfCarName.setText(car.getCarName());
        spinnerYear.getValueFactory().setValue(car.getModelYear());
        cbColor.setValue(car.getColor());
        spinnerCapacity.getValueFactory().setValue(car.getCapacity());
        tfRentPrice.setText(String.valueOf(car.getRentPrice()));
        dpImport.setValue(car.getImportDate());
        cbProducer.setValue(car.getProducer());
        taDesc.setText(car.getDescription());
        switch (car.getStatus()) {
            case "Đang cho thuê" -> rbRenting.setSelected(true);
            case "Bảo dưỡng"    -> rbMaintenance.setSelected(true);
            default              -> rbAvailable.setSelected(true);
        }
    }

    @FXML
    private void handleSave() {
        boolean valid = true;

        // Validate tên xe
        if (tfCarName.getText().trim().length() < 3) {
            errCarName.setText("Tên xe phải có 3–100 ký tự.");
            tfCarName.getStyleClass().add("field-error");
            valid = false;
        }

        // Validate giá thuê
        try {
            double price = Double.parseDouble(tfRentPrice.getText().trim());
            if (price <= 0) {
                errRentPrice.setText("Giá thuê phải > 0.");
                valid = false;
            }
        } catch (NumberFormatException e) {
            errRentPrice.setText("Giá thuê không hợp lệ.");
            valid = false;
        }

        // Validate ngày nhập
        if (dpImport.getValue() == null) {
            errImport.setText("Vui lòng chọn ngày nhập.");
            valid = false;
        } else if (dpImport.getValue().isAfter(LocalDate.now())) {
            errImport.setText("Ngày nhập không được là tương lai.");
            valid = false;
        }

        // Validate nhà SX
        if (cbProducer.getValue() == null) {
            errProducer.setText("Vui lòng chọn nhà sản xuất.");
            valid = false;
        }

        if (!valid) return;

        // Xác nhận lưu
        Alert confirm = new Alert(Alert.AlertType.CONFIRMATION,
            "Xác nhận " + (isEditMode ? "cập nhật" : "thêm mới") + "?",
            ButtonType.YES, ButtonType.NO);
        confirm.showAndWait().ifPresent(btn -> {
            if (btn == ButtonType.YES) closeDialog();
        });
    }

    @FXML
    private void handleCancel() { closeDialog(); }

    private void closeDialog() {
        ((Stage) tfCarName.getScene().getWindow()).close();
    }
}
```

**✅ Kiểm tra:**
- [ ] Spinner năm giới hạn 1990–2030; số chỗ 2–16
- [ ] Giá thuê từ chối ký tự chữ cái ngay khi gõ
- [ ] Nhấn LƯU khi bỏ trống tên xe → Label lỗi đỏ xuất hiện ngay dưới field, KHÔNG có Alert
- [ ] Ngày nhập là ngày tương lai → lỗi inline
- [ ] Nhấn LƯU hợp lệ → Alert xác nhận

---

### BƯỚC 4 — Mở dialog từ màn hình danh sách

Thêm method vào `ListController.java` (hoặc `CarController`):

```java
@FXML
private void handleAddCar() {
    try {
        FXMLLoader loader = new FXMLLoader(
            getClass().getResource("/com/fucar/car-dialog.fxml"));
        Stage dialog = new Stage();
        dialog.setScene(new Scene(loader.load()));
        dialog.setResizable(false);
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.initOwner(tableView.getScene().getWindow());
        dialog.showAndWait();
    } catch (Exception e) { e.printStackTrace(); }
}

@FXML
private void handleEditCar() {
    Car selected = getSelectedCar(); // lấy xe đang chọn
    if (selected == null) return;
    try {
        FXMLLoader loader = new FXMLLoader(
            getClass().getResource("/com/fucar/car-dialog.fxml"));
        Stage dialog = new Stage();
        dialog.setScene(new Scene(loader.load()));
        dialog.setResizable(false);
        dialog.initModality(Modality.APPLICATION_MODAL);
        dialog.initOwner(tableView.getScene().getWindow());

        CarDialogController ctrl = loader.getController();
        ctrl.setEditMode(selected);  // truyền dữ liệu xe

        dialog.showAndWait();
    } catch (Exception e) { e.printStackTrace(); }
}
```

**✅ Kiểm tra:**
- [ ] Dialog mở đúng với Modality (cửa sổ cha bị khóa)
- [ ] Tiêu đề dialog thay đổi: "Thêm..." hoặc "Chỉnh sửa..."
- [ ] Ở chế độ Edit: form được điền sẵn dữ liệu xe đã chọn

---

## PHẦN 8 — BÀI NC2: QUẢN LÝ KHÁCH HÀNG + CONTEXT MENU

### Mục tiêu
TableView Customer + tìm kiếm real-time + Context Menu chuột phải + xóa nhiều dòng.

---

### BƯỚC 1 — Tạo class Customer.java

**Thao tác:** Chuột phải `com.fucar.model` → `New` → `Java Class` → `Customer`.

```java
package com.fucar.model;

import java.time.LocalDate;

public class Customer {
    private String    customerId, customerName, mobile, identityCard, email, accountStatus;
    private LocalDate birthday;

    public Customer(String id, String name, String mobile,
                    LocalDate birthday, String idCard,
                    String email, String status) {
        this.customerId    = id;
        this.customerName  = name;
        this.mobile        = mobile;
        this.birthday      = birthday;
        this.identityCard  = idCard;
        this.email         = email;
        this.accountStatus = status;
    }

    public String    getCustomerId()    { return customerId; }
    public String    getCustomerName()  { return customerName; }
    public String    getMobile()        { return mobile; }
    public LocalDate getBirthday()      { return birthday; }
    public String    getIdentityCard()  { return identityCard; }
    public String    getEmail()         { return email; }
    public String    getAccountStatus() { return accountStatus; }
    public void      setAccountStatus(String s) { accountStatus = s; }
}
```

**✅ Kiểm tra:**
- [ ] Getter `getCustomerId()`, `getCustomerName()`, `getAccountStatus()` có đủ
- [ ] `setAccountStatus()` có để có thể đổi trạng thái

---

### BƯỚC 2 — Tạo customer-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `customer-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="10" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.CustomerController"
      stylesheets="@style.css"
      prefWidth="860" prefHeight="500">
    <padding><Insets top="15" right="15" bottom="15" left="15"/></padding>

    <!-- Thanh công cụ -->
    <HBox spacing="8" alignment="CENTER_LEFT">
        <Label text="QUẢN LÝ KHÁCH HÀNG" styleClass="screen-title"/>
        <Region HBox.hgrow="ALWAYS"/>
        <Button text="+ Thêm KH" onAction="#handleAdd" styleClass="btn-primary"/>
        <Button fx:id="btnDeleteMulti" text="Xóa nhiều"
                onAction="#handleDeleteMulti" styleClass="btn-danger" disable="true"/>
        <Button text="Xuất Excel" onAction="#handleExport" styleClass="btn-success"/>
    </HBox>

    <!-- Tìm kiếm -->
    <HBox spacing="8" alignment="CENTER_LEFT">
        <TextField fx:id="searchField"
                   promptText="Tìm theo tên, SĐT, CCCD, email..." prefWidth="320"/>
        <ComboBox fx:id="cbSearchField" prefWidth="170"/>
        <Button text="Xóa bộ lọc" onAction="#handleClearFilter"/>
        <Region HBox.hgrow="ALWAYS"/>
        <Label fx:id="lblCount" style="-fx-text-fill:#555555;"/>
    </HBox>

    <!-- TableView -->
    <TableView fx:id="tableCustomer" VBox.vgrow="ALWAYS">
        <columns>
            <TableColumn fx:id="colId"      text="Mã KH"      prefWidth="90"/>
            <TableColumn fx:id="colName"    text="Họ tên"     prefWidth="170"/>
            <TableColumn fx:id="colMobile"  text="Số ĐT"      prefWidth="110"/>
            <TableColumn fx:id="colBirth"   text="Ngày sinh"  prefWidth="100"/>
            <TableColumn fx:id="colIdCard"  text="CCCD"       prefWidth="120"/>
            <TableColumn fx:id="colEmail"   text="Email"      prefWidth="170"/>
            <TableColumn fx:id="colStatus"  text="Trạng thái" prefWidth="110"/>
        </columns>
        <placeholder><Label text="Không có dữ liệu khách hàng"/></placeholder>
    </TableView>
</VBox>
```

**✅ Kiểm tra:**
- [ ] Mở Scene Builder: thấy 7 cột trong TableView
- [ ] `fx:id` của TableView là `tableCustomer`
- [ ] `btnDeleteMulti` có `disable="true"`

---

### BƯỚC 3 — Tạo CustomerController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `CustomerController`.

```java
package com.fucar.controller;

import com.fucar.model.Customer;
import javafx.collections.*;
import javafx.collections.transformation.*;
import javafx.fxml.*;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CustomerController {

    @FXML private TableView<Customer>          tableCustomer;
    @FXML private TableColumn<Customer,String> colId, colName, colMobile,
                                               colBirth, colIdCard, colEmail;
    @FXML private TableColumn<Customer,String> colStatus;
    @FXML private TextField    searchField;
    @FXML private ComboBox<String> cbSearchField;
    @FXML private Label        lblCount;
    @FXML private Button       btnDeleteMulti;

    private ObservableList<Customer> masterData;
    private FilteredList<Customer>   filteredData;
    private static final DateTimeFormatter FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @FXML
    public void initialize() {
        setupColumns();
        loadSampleData();
        setupSearch();
        setupMultiSelect();
        setupContextMenu();
        updateCountLabel();
    }

    private void setupColumns() {
        colId.setCellValueFactory(new PropertyValueFactory<>("customerId"));
        colName.setCellValueFactory(new PropertyValueFactory<>("customerName"));
        colMobile.setCellValueFactory(new PropertyValueFactory<>("mobile"));
        colIdCard.setCellValueFactory(new PropertyValueFactory<>("identityCard"));
        colEmail.setCellValueFactory(new PropertyValueFactory<>("email"));

        // Cột ngày sinh — định dạng dd/MM/yyyy
        colBirth.setCellFactory(col -> new TableCell<>() {
            @Override protected void updateItem(String item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || getTableRow().getItem() == null) {
                    setText(null); return;
                }
                Customer c = (Customer) getTableRow().getItem();
                setText(c.getBirthday() != null
                    ? c.getBirthday().format(FMT) : "");
            }
        });

        // Cột trạng thái — Badge màu
        colStatus.setCellValueFactory(new PropertyValueFactory<>("accountStatus"));
        colStatus.setCellFactory(col -> new TableCell<>() {
            @Override protected void updateItem(String status, boolean empty) {
                super.updateItem(status, empty);
                if (empty || status == null) { setGraphic(null); return; }
                Label badge = new Label(status);
                badge.setStyle(badgeStyle(status));
                setGraphic(badge); setText(null);
            }
        });
    }

    private void loadSampleData() {
        masterData = FXCollections.observableArrayList(
            new Customer("CUS-001","Nguyễn Văn An","0912345678",
                LocalDate.of(1995,3,15),"123456789012","an@mail.com","Hoạt động"),
            new Customer("CUS-002","Trần Thị Bình","0987654321",
                LocalDate.of(1998,7,20),"234567890123","binh@mail.com","Chờ xác nhận"),
            new Customer("CUS-003","Lê Văn Cường","0971234567",
                LocalDate.of(1992,11,5),"345678901234","cuong@mail.com","Không hoạt động"),
            new Customer("CUS-004","Phạm Thị Dung","0961234567",
                LocalDate.of(2000,5,12),"456789012345","dung@mail.com","Hoạt động")
        );
        filteredData = new FilteredList<>(masterData, p -> true);
        SortedList<Customer> sorted = new SortedList<>(filteredData);
        sorted.comparatorProperty().bind(tableCustomer.comparatorProperty());
        tableCustomer.setItems(sorted);
    }

    private void setupSearch() {
        cbSearchField.getItems().addAll(
            "Tất cả trường","Họ tên","Số điện thoại","CCCD","Email");
        cbSearchField.setValue("Tất cả trường");

        // Real-time: lọc ngay khi gõ hoặc đổi trường
        searchField.textProperty().addListener(
            (obs, o, kw) -> applyFilter(kw));
        cbSearchField.valueProperty().addListener(
            (obs, o, f) -> applyFilter(searchField.getText()));
    }

    private void applyFilter(String keyword) {
        String field = cbSearchField.getValue();
        filteredData.setPredicate(c -> {
            if (keyword == null || keyword.trim().isEmpty()) return true;
            String kw = keyword.toLowerCase();
            return switch (field) {
                case "Họ tên"          -> c.getCustomerName().toLowerCase().contains(kw);
                case "Số điện thoại"   -> c.getMobile().contains(kw);
                case "CCCD"            -> c.getIdentityCard().contains(kw);
                case "Email"           -> c.getEmail().toLowerCase().contains(kw);
                default -> c.getCustomerName().toLowerCase().contains(kw)
                        || c.getMobile().contains(kw)
                        || c.getEmail().toLowerCase().contains(kw);
            };
        });
        updateCountLabel();
    }

    private void setupMultiSelect() {
        tableCustomer.getSelectionModel()
            .setSelectionMode(SelectionMode.MULTIPLE);
        // Bật nút "Xóa nhiều" khi có ít nhất 1 dòng được chọn
        tableCustomer.getSelectionModel().getSelectedItems()
            .addListener((ListChangeListener<Customer>) c ->
                btnDeleteMulti.setDisable(
                    tableCustomer.getSelectionModel().isEmpty()));
    }

    private void setupContextMenu() {
        ContextMenu menu = new ContextMenu();

        MenuItem miView = new MenuItem("Xem chi tiết");
        MenuItem miEdit = new MenuItem("Chỉnh sửa");
        MenuItem miPwd  = new MenuItem("Đổi mật khẩu");
        SeparatorMenuItem sep = new SeparatorMenuItem();
        MenuItem miLock = new MenuItem("Khóa tài khoản");
        miLock.setStyle("-fx-text-fill: red;");

        miView.setOnAction(e -> showDetailAlert());
        miEdit.setOnAction(e -> alert("Mở form chỉnh sửa KH."));
        miPwd.setOnAction(e ->  alert("Mở dialog đổi mật khẩu."));
        miLock.setOnAction(e -> confirmLock());

        menu.getItems().addAll(miView, miEdit, miPwd, sep, miLock);
        tableCustomer.setContextMenu(menu);
    }

    private void showDetailAlert() {
        Customer c = tableCustomer.getSelectionModel().getSelectedItem();
        if (c == null) return;
        alert("Mã: " + c.getCustomerId() + "\nTên: " + c.getCustomerName()
            + "\nSĐT: " + c.getMobile());
    }

    private void confirmLock() {
        Customer c = tableCustomer.getSelectionModel().getSelectedItem();
        if (c == null) return;
        new Alert(Alert.AlertType.CONFIRMATION,
            "Khóa tài khoản \"" + c.getCustomerName() + "\"?",
            ButtonType.YES, ButtonType.NO)
            .showAndWait().ifPresent(btn -> {
                if (btn == ButtonType.YES) alert("Đã khóa tài khoản.");
            });
    }

    @FXML private void handleAdd() { alert("Mở form thêm KH."); }

    @FXML
    private void handleDeleteMulti() {
        int count = tableCustomer.getSelectionModel().getSelectedItems().size();
        new Alert(Alert.AlertType.CONFIRMATION,
            "Xóa " + count + " KH đã chọn?", ButtonType.YES, ButtonType.NO)
            .showAndWait().ifPresent(btn -> {
                if (btn == ButtonType.YES) {
                    masterData.removeAll(
                        tableCustomer.getSelectionModel().getSelectedItems());
                    updateCountLabel();
                }
            });
    }

    @FXML private void handleExport()     { alert("Xuất Excel: Đang phát triển."); }
    @FXML private void handleClearFilter(){ searchField.clear();
                                            cbSearchField.setValue("Tất cả trường"); }

    private void updateCountLabel() {
        lblCount.setText("Tổng: " + masterData.size()
            + " KH  |  Hiển thị: " + filteredData.size());
    }

    private void alert(String msg) {
        new Alert(Alert.AlertType.INFORMATION, msg, ButtonType.OK).showAndWait();
    }

    private String badgeStyle(String status) {
        String color = switch (status) {
            case "Hoạt động"       -> "#2E7D32";
            case "Không hoạt động" -> "#C62828";
            default                -> "#F57F17";
        };
        return "-fx-background-color:" + color
            + ";-fx-text-fill:white;-fx-background-radius:12;"
            + "-fx-padding:2 10 2 10;-fx-font-weight:bold;";
    }
}
```

**✅ Kiểm tra sau NC2:**
- [ ] Gõ vào ô tìm kiếm → bảng lọc ngay lập tức
- [ ] Đổi ComboBox "Lọc theo" → tìm kiếm đúng trường tương ứng
- [ ] Label "Tổng / Hiển thị" cập nhật đúng số lượng
- [ ] Ctrl+click, Shift+click chọn được nhiều dòng
- [ ] Chuột phải vào dòng → Context Menu hiện 4 mục + separator
- [ ] "Khóa tài khoản" hiện Alert xác nhận trước khi thực hiện
- [ ] Nút "Xóa nhiều" chỉ sáng khi có dòng được chọn
- [ ] Badge trạng thái màu xanh/đỏ/vàng phân biệt rõ

---

## PHẦN 9 — BÀI NC3: FORM THUÊ XE + PROPERTY BINDING

### Mục tiêu
Tự động tính thành tiền = Giá/ngày × Số ngày bằng **Property Binding**.  
ProgressBar theo dõi số ngày (max 30). Gom tất cả lỗi vào 1 Alert.

---

### BƯỚC 1 — Tạo rental-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `rental-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="14" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.RentalController"
      stylesheets="@style.css"
      prefWidth="620" prefHeight="580">
    <padding><Insets top="20" right="25" bottom="20" left="25"/></padding>

    <Label text="TẠO GIAO DỊCH THUÊ XE" styleClass="screen-title"/>

    <!-- Thông tin KH -->
    <TitledPane text="Thông tin khách hàng" collapsible="false">
        <GridPane hgap="10" vgap="8">
            <padding><Insets top="10" right="10" bottom="10" left="10"/></padding>
            <Label text="Khách hàng *:"  GridPane.columnIndex="0" GridPane.rowIndex="0"/>
            <HBox spacing="6"            GridPane.columnIndex="1" GridPane.rowIndex="0">
                <ComboBox fx:id="customerCombo" prefWidth="250"
                          promptText="Chọn khách hàng"/>
                <Button text="Tìm KH" onAction="#handleFindCustomer"/>
            </HBox>
            <Label text="Mã KH:"         GridPane.columnIndex="0" GridPane.rowIndex="1"/>
            <Label fx:id="lblCusId"      GridPane.columnIndex="1" GridPane.rowIndex="1"/>
            <Label text="SĐT:"           GridPane.columnIndex="0" GridPane.rowIndex="2"/>
            <Label fx:id="lblCusMobile"  GridPane.columnIndex="1" GridPane.rowIndex="2"/>
            <ColumnConstraints minWidth="120"/>
            <ColumnConstraints hgrow="ALWAYS"/>
        </GridPane>
    </TitledPane>

    <!-- Thông tin xe -->
    <TitledPane text="Thông tin xe" collapsible="false">
        <GridPane hgap="10" vgap="8">
            <padding><Insets top="10" right="10" bottom="10" left="10"/></padding>
            <Label text="Xe *:"           GridPane.columnIndex="0" GridPane.rowIndex="0"/>
            <HBox spacing="6"             GridPane.columnIndex="1" GridPane.rowIndex="0">
                <ComboBox fx:id="carCombo" prefWidth="250"
                          promptText="Chọn xe (Có sẵn)"/>
                <Button text="Tìm xe" onAction="#handleFindCar"/>
            </HBox>
            <Label text="Tên xe:"         GridPane.columnIndex="0" GridPane.rowIndex="1"/>
            <Label fx:id="lblCarName"     GridPane.columnIndex="1" GridPane.rowIndex="1"/>
            <Label text="Giá thuê/ngày:"  GridPane.columnIndex="0" GridPane.rowIndex="2"/>
            <Label fx:id="lblPricePerDay" GridPane.columnIndex="1" GridPane.rowIndex="2"
                   style="-fx-font-weight:bold;-fx-text-fill:#1565C0;"/>
            <ColumnConstraints minWidth="120"/>
            <ColumnConstraints hgrow="ALWAYS"/>
        </GridPane>
    </TitledPane>

    <!-- Thời gian thuê -->
    <TitledPane text="Thời gian thuê" collapsible="false">
        <GridPane hgap="10" vgap="8">
            <padding><Insets top="10" right="10" bottom="10" left="10"/></padding>
            <Label text="Ngày lấy xe *:" GridPane.columnIndex="0" GridPane.rowIndex="0"/>
            <DatePicker fx:id="dpPickup" GridPane.columnIndex="1" GridPane.rowIndex="0"/>
            <Label text="Ngày trả xe *:" GridPane.columnIndex="0" GridPane.rowIndex="1"/>
            <DatePicker fx:id="dpReturn" GridPane.columnIndex="1" GridPane.rowIndex="1"/>
            <Label text="Số ngày:"       GridPane.columnIndex="0" GridPane.rowIndex="2"/>
            <Label fx:id="lblDays"       GridPane.columnIndex="1" GridPane.rowIndex="2"
                   style="-fx-font-weight:bold;"/>
            <Label text="Tiến độ (max 30 ngày):"
                                         GridPane.columnIndex="0" GridPane.rowIndex="3"/>
            <ProgressBar fx:id="progressDays"
                                         GridPane.columnIndex="1" GridPane.rowIndex="3"
                         prefWidth="200" progress="0"/>
            <ColumnConstraints minWidth="160"/>
            <ColumnConstraints hgrow="ALWAYS"/>
        </GridPane>
    </TitledPane>

    <!-- Tổng tiền -->
    <HBox spacing="20" alignment="CENTER_LEFT"
          style="-fx-background-color:#E3F2FD;-fx-background-radius:8;-fx-padding:12;">
        <Label text="THÀNH TIỀN:"
               style="-fx-font-size:16px;-fx-font-weight:bold;"/>
        <Label fx:id="lblTotal"
               style="-fx-font-size:20px;-fx-font-weight:bold;-fx-text-fill:#C62828;"/>
        <Region HBox.hgrow="ALWAYS"/>
        <ComboBox fx:id="cbStatus" prefWidth="170"/>
    </HBox>

    <!-- Nút -->
    <HBox spacing="10" alignment="CENTER_RIGHT">
        <Button text="HỦY"          onAction="#handleCancel"/>
        <Button text="TẠO GIAO DỊCH" onAction="#handleCreate"
                styleClass="btn-primary" defaultButton="true"/>
    </HBox>
</VBox>
```

**✅ Kiểm tra:**
- [ ] Mở Scene Builder: thấy 3 TitledPane và HBox thành tiền
- [ ] `fx:id` có: `customerCombo`, `carCombo`, `dpPickup`, `dpReturn`, `lblDays`, `progressDays`, `lblTotal`

---

### BƯỚC 2 — Tạo RentalController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `RentalController`.

```java
package com.fucar.controller;

import com.fucar.model.Car;
import com.fucar.model.Customer;
import javafx.beans.property.*;
import javafx.fxml.*;
import javafx.scene.control.*;
import javafx.stage.Stage;
import javafx.util.StringConverter;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class RentalController {

    @FXML private ComboBox<Customer> customerCombo;
    @FXML private ComboBox<Car>      carCombo;
    @FXML private DatePicker dpPickup, dpReturn;
    @FXML private Label lblCusId, lblCusMobile, lblCarName,
                        lblPricePerDay, lblDays, lblTotal;
    @FXML private ProgressBar progressDays;
    @FXML private ComboBox<String> cbStatus;

    private final LongProperty   numDays     = new SimpleLongProperty(0);
    private final DoubleProperty pricePerDay = new SimpleDoubleProperty(0);
    private final NumberFormat   fmt =
        NumberFormat.getInstance(new Locale("vi","VN"));

    @FXML
    public void initialize() {
        setupCustomerCombo();
        setupCarCombo();
        setupDatePickers();
        cbStatus.getItems().addAll("Đã xác nhận","Chờ xác nhận","Đã hủy");
        cbStatus.setValue("Chờ xác nhận");
        lblTotal.setText("0 VNĐ");
        lblDays.setText("—");
    }

    private void setupCustomerCombo() {
        customerCombo.getItems().addAll(
            new Customer("CUS-001","Nguyễn Văn An","0912345678",
                LocalDate.of(1995,3,15),"CK001","an@mail.com","Hoạt động"),
            new Customer("CUS-002","Trần Thị Bình","0987654321",
                LocalDate.of(1998,7,20),"CK002","binh@mail.com","Hoạt động")
        );
        customerCombo.setConverter(new StringConverter<>() {
            public String toString(Customer c) {
                return c==null?"":c.getCustomerName()+" ("+c.getCustomerId()+")";
            }
            public Customer fromString(String s) { return null; }
        });
        customerCombo.valueProperty().addListener((obs,o,c) -> {
            if (c != null) {
                lblCusId.setText(c.getCustomerId());
                lblCusMobile.setText(c.getMobile());
            }
        });
    }

    private void setupCarCombo() {
        Car c1 = new Car(); c1.setCarId("CAR-001");
        c1.setCarName("Toyota Camry"); c1.setRentPrice(800000);
        Car c2 = new Car(); c2.setCarId("CAR-002");
        c2.setCarName("Honda Civic");  c2.setRentPrice(600000);
        carCombo.getItems().addAll(c1, c2);
        carCombo.setConverter(new StringConverter<>() {
            public String toString(Car c) {
                return c==null?"":c.getCarName()+" ("+c.getCarId()+")";
            }
            public Car fromString(String s) { return null; }
        });
        carCombo.valueProperty().addListener((obs,o,car) -> {
            if (car != null) {
                lblCarName.setText(car.getCarName());
                pricePerDay.set(car.getRentPrice());
                lblPricePerDay.setText(fmt.format(car.getRentPrice())+" VNĐ");
                updateTotal();
            }
        });
    }

    private void setupDatePickers() {
        // Ngày lấy không được là quá khứ
        dpPickup.setDayCellFactory(p -> new DateCell() {
            @Override public void updateItem(LocalDate d, boolean empty) {
                super.updateItem(d, empty);
                setDisable(empty || d.isBefore(LocalDate.now()));
            }
        });

        // Khi đổi ngày → tính lại số ngày
        dpPickup.valueProperty().addListener((obs,o,d) -> recalcDays());
        dpReturn.valueProperty().addListener((obs,o,d) -> recalcDays());
    }

    private void recalcDays() {
        LocalDate pickup = dpPickup.getValue();
        LocalDate ret    = dpReturn.getValue();

        // Cập nhật DateCell ngày trả: phải sau ngày lấy
        if (pickup != null) {
            dpReturn.setDayCellFactory(p -> new DateCell() {
                @Override public void updateItem(LocalDate d, boolean empty) {
                    super.updateItem(d, empty);
                    setDisable(empty || !d.isAfter(pickup));
                }
            });
        }

        if (pickup != null && ret != null && ret.isAfter(pickup)) {
            long days = ChronoUnit.DAYS.between(pickup, ret);
            numDays.set(days);
            lblDays.setText(days + " ngày");
            progressDays.setProgress(Math.min(days / 30.0, 1.0));
        } else {
            numDays.set(0);
            lblDays.setText("—");
            progressDays.setProgress(0);
        }
        updateTotal();
    }

    private void updateTotal() {
        double total = pricePerDay.get() * numDays.get();
        lblTotal.setText(fmt.format(total) + " VNĐ");
    }

    @FXML
    private void handleCreate() {
        List<String> errors = new ArrayList<>();

        if (customerCombo.getValue() == null)
            errors.add("• Chưa chọn khách hàng.");
        if (carCombo.getValue() == null)
            errors.add("• Chưa chọn xe.");
        if (dpPickup.getValue() == null)
            errors.add("• Chưa chọn ngày lấy xe.");
        else if (dpPickup.getValue().isBefore(LocalDate.now()))
            errors.add("• Ngày lấy xe phải ≥ hôm nay.");
        if (dpReturn.getValue() == null)
            errors.add("• Chưa chọn ngày trả xe.");
        if (numDays.get() > 30)
            errors.add("• Số ngày thuê tối đa 30 ngày.");
        if (numDays.get() == 0 && dpPickup.getValue() != null && dpReturn.getValue() != null)
            errors.add("• Ngày trả phải sau ngày lấy ít nhất 1 ngày.");

        if (!errors.isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setTitle("Lỗi xác thực");
            alert.setHeaderText("Vui lòng kiểm tra các thông tin sau:");
            alert.setContentText(String.join("\n", errors));
            alert.showAndWait();
            return;
        }

        new Alert(Alert.AlertType.INFORMATION,
            "Tạo giao dịch thành công!", ButtonType.OK).showAndWait();
        handleCancel();
    }

    @FXML private void handleFindCustomer() {
        new Alert(Alert.AlertType.INFORMATION,
            "Dialog tìm KH (chưa triển khai).", ButtonType.OK).showAndWait();
    }
    @FXML private void handleFindCar() {
        new Alert(Alert.AlertType.INFORMATION,
            "Dialog tìm xe (chưa triển khai).", ButtonType.OK).showAndWait();
    }
    @FXML private void handleCancel() {
        ((Stage) lblDays.getScene().getWindow()).close();
    }
}
```

**✅ Kiểm tra sau NC3:**
- [ ] Chọn KH → label Mã KH và SĐT cập nhật ngay
- [ ] Chọn xe → Tên xe và Giá/ngày cập nhật ngay
- [ ] DatePicker ngày lấy không cho chọn ngày hôm qua
- [ ] Chọn ngày lấy trước → DatePicker ngày trả tự giới hạn phải sau đó
- [ ] Chọn cả 2 ngày → Label "Số ngày" và ProgressBar cập nhật
- [ ] Thành tiền = Giá/ngày × Số ngày, tự tính khi đổi bất kỳ giá trị nào
- [ ] ProgressBar đầy (100%) khi đạt 30 ngày
- [ ] Nhấn "TẠO GIAO DỊCH" khi thiếu thông tin → 1 Alert liệt kê TẤT CẢ lỗi

---

## PHẦN 10 — BÀI NC4: BÁO CÁO THỐNG KÊ VỚI CHART

### Mục tiêu
4 thẻ tóm tắt + TabPane với BarChart (2 series), LineChart, PieChart + TableView chi tiết.

---

### BƯỚC 1 — Tạo report-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `report-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.scene.chart.*?>
<?import javafx.geometry.Insets?>

<VBox spacing="12" xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.fucar.controller.ReportController"
      stylesheets="@style.css"
      prefWidth="860" prefHeight="640">
    <padding><Insets top="15" right="15" bottom="15" left="15"/></padding>

    <!-- Bộ lọc -->
    <HBox spacing="10" alignment="CENTER_LEFT">
        <Label text="Từ ngày:"/>
        <DatePicker fx:id="dpStart" prefWidth="140"/>
        <Label text="Đến ngày:"/>
        <DatePicker fx:id="dpEnd" prefWidth="140"/>
        <ComboBox fx:id="cbReportType" prefWidth="210"/>
        <Button text="Tạo báo cáo" onAction="#handleGenerate" styleClass="btn-primary"/>
        <Button text="Xuất PDF"    onAction="#handleExportPdf" styleClass="btn-danger"/>
    </HBox>

    <!-- 4 thẻ tóm tắt -->
    <HBox spacing="12">
        <VBox fx:id="cardTotal"   styleClass="card" prefWidth="190"
              alignment="CENTER" spacing="6"/>
        <VBox fx:id="cardRevenue" styleClass="card" prefWidth="190"
              alignment="CENTER" spacing="6"/>
        <VBox fx:id="cardCars"    styleClass="card" prefWidth="190"
              alignment="CENTER" spacing="6"/>
        <VBox fx:id="cardNewCus"  styleClass="card" prefWidth="190"
              alignment="CENTER" spacing="6"/>
    </HBox>

    <!-- TabPane chart -->
    <TabPane VBox.vgrow="ALWAYS" tabClosingPolicy="UNAVAILABLE">
        <Tab text="📊 Biểu đồ cột">
            <BarChart fx:id="barChart">
                <xAxis><CategoryAxis label="Tháng"/></xAxis>
                <yAxis><NumberAxis label="Doanh thu (triệu VNĐ)"/></yAxis>
            </BarChart>
        </Tab>
        <Tab text="📈 Biểu đồ đường">
            <LineChart fx:id="lineChart">
                <xAxis><CategoryAxis label="Tuần"/></xAxis>
                <yAxis><NumberAxis label="Số giao dịch"/></yAxis>
            </LineChart>
        </Tab>
        <Tab text="🥧 Biểu đồ tròn">
            <PieChart fx:id="pieChart" labelsVisible="true"/>
        </Tab>
    </TabPane>

    <!-- Bảng chi tiết -->
    <TableView fx:id="tableDetail" prefHeight="160">
        <columns>
            <TableColumn text="STT"        prefWidth="45"/>
            <TableColumn text="Mã GD"      prefWidth="90"/>
            <TableColumn text="Tên KH"     prefWidth="150"/>
            <TableColumn text="Tên xe"     prefWidth="150"/>
            <TableColumn text="Ngày lấy"   prefWidth="90"/>
            <TableColumn text="Ngày trả"   prefWidth="90"/>
            <TableColumn text="Thành tiền" prefWidth="120"/>
            <TableColumn text="Trạng thái" prefWidth="100"/>
        </columns>
        <placeholder><Label text="Không có giao dịch trong khoảng thời gian này"/></placeholder>
    </TableView>
</VBox>
```

**✅ Kiểm tra:**
- [ ] Mở Scene Builder: thấy TabPane với 3 tab
- [ ] `fx:id` của 4 VBox thẻ tóm tắt: `cardTotal`, `cardRevenue`, `cardCars`, `cardNewCus`

---

### BƯỚC 2 — Tạo ReportController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `ReportController`.

```java
package com.fucar.controller;

import javafx.collections.FXCollections;
import javafx.fxml.*;
import javafx.scene.chart.*;
import javafx.scene.control.*;
import javafx.scene.layout.VBox;
import java.time.LocalDate;

public class ReportController {

    @FXML private DatePicker dpStart, dpEnd;
    @FXML private ComboBox<String> cbReportType;
    @FXML private BarChart<String,Number>  barChart;
    @FXML private LineChart<String,Number> lineChart;
    @FXML private PieChart     pieChart;
    @FXML private TableView<?> tableDetail;
    @FXML private VBox cardTotal, cardRevenue, cardCars, cardNewCus;

    @FXML
    public void initialize() {
        // Mặc định: đầu tháng → hôm nay
        dpStart.setValue(LocalDate.now().withDayOfMonth(1));
        dpEnd.setValue(LocalDate.now());

        cbReportType.getItems().addAll(
            "Doanh thu theo tháng","Số lượng giao dịch",
            "Top xe được thuê","Trạng thái giao dịch");
        cbReportType.setValue("Doanh thu theo tháng");

        // Validate: dpEnd phải >= dpStart
        dpEnd.valueProperty().addListener((obs,old,date) -> {
            if (date != null && dpStart.getValue() != null
                    && date.isBefore(dpStart.getValue())) {
                new Alert(Alert.AlertType.WARNING,
                    "Đến ngày phải ≥ Từ ngày!", ButtonType.OK).showAndWait();
                dpEnd.setValue(old);
            }
        });

        buildSummaryCards();
        loadBarChart();
        loadLineChart();
        loadPieChart();
    }

    private void buildSummaryCards() {
        fillCard(cardTotal,   "156",           "Tổng giao dịch",  "#1565C0");
        fillCard(cardRevenue, "124.500.000 ₫", "Tổng doanh thu",  "#2E7D32");
        fillCard(cardCars,    "23",            "Xe được thuê",    "#F57F17");
        fillCard(cardNewCus,  "18",            "Khách hàng mới",  "#6A1B9A");
    }

    private void fillCard(VBox card, String number, String title, String color) {
        card.setStyle("-fx-background-color:" + color
            + ";-fx-background-radius:10;-fx-padding:16;");
        Label lNum = new Label(number);
        lNum.setStyle("-fx-font-size:26px;-fx-font-weight:bold;-fx-text-fill:white;");
        Label lTitle = new Label(title);
        lTitle.setStyle("-fx-font-size:12px;-fx-text-fill:rgba(255,255,255,0.85);");
        card.getChildren().setAll(lNum, lTitle);
    }

    private void loadBarChart() {
        barChart.getData().clear();
        barChart.setTitle("Doanh thu theo tháng (triệu VNĐ)");
        barChart.setAnimated(true);

        String[] months = {"T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"};
        double[] last = {8,12,10,15,11,14,9,13,16,10,12,18};
        double[] curr = {10,14,13,17,15,19,12,16,20,14,15,22};

        XYChart.Series<String,Number> sLast = new XYChart.Series<>();
        sLast.setName("Năm trước");
        XYChart.Series<String,Number> sCurr = new XYChart.Series<>();
        sCurr.setName("Năm nay");

        for (int i = 0; i < months.length; i++) {
            sLast.getData().add(new XYChart.Data<>(months[i], last[i]));
            sCurr.getData().add(new XYChart.Data<>(months[i], curr[i]));
        }
        barChart.getData().addAll(sLast, sCurr);
    }

    private void loadLineChart() {
        lineChart.getData().clear();
        lineChart.setTitle("Số giao dịch theo tuần");
        lineChart.setCreateSymbols(true);

        XYChart.Series<String,Number> s = new XYChart.Series<>();
        s.setName("Giao dịch");
        String[] weeks = {"Tuần 1","Tuần 2","Tuần 3","Tuần 4"};
        int[]    vals  = {12, 18, 15, 22};
        for (int i = 0; i < weeks.length; i++)
            s.getData().add(new XYChart.Data<>(weeks[i], vals[i]));
        lineChart.getData().add(s);
    }

    private void loadPieChart() {
        pieChart.setTitle("Phân bố trạng thái giao dịch");
        pieChart.setData(FXCollections.observableArrayList(
            new PieChart.Data("Đã xác nhận (65%)", 65),
            new PieChart.Data("Chờ xác nhận (25%)", 25),
            new PieChart.Data("Đã hủy (10%)",       10)
        ));
    }

    @FXML
    private void handleGenerate() {
        if (dpStart.getValue() == null || dpEnd.getValue() == null) {
            new Alert(Alert.AlertType.WARNING,
                "Vui lòng chọn khoảng thời gian!", ButtonType.OK).showAndWait();
            return;
        }
        loadBarChart(); loadLineChart(); loadPieChart();
    }

    @FXML
    private void handleExportPdf() {
        new Alert(Alert.AlertType.INFORMATION,
            "Xuất PDF: Chức năng đang phát triển.", ButtonType.OK).showAndWait();
    }
}
```

**✅ Kiểm tra sau NC4:**
- [ ] `dpStart` mặc định = ngày đầu tháng; `dpEnd` = hôm nay
- [ ] Đổi `dpEnd` về trước `dpStart` → Alert cảnh báo, giá trị reset về cũ
- [ ] 4 thẻ màu khác nhau, số liệu hiển thị rõ
- [ ] Tab "Biểu đồ cột": có 12 tháng, 2 series màu khác nhau, có legend
- [ ] Tab "Biểu đồ đường": đường có điểm đánh dấu (createSymbols=true)
- [ ] Tab "Biểu đồ tròn": 3 phần có nhãn phần trăm
- [ ] Nút "Tạo báo cáo" reload chart

---

## PHẦN 11 — BÀI NC5: CSS TOÀN DIỆN + ACCORDION + PHÍM TẮT

### Mục tiêu
Accordion menu trái, SplitPane chi tiết xe, Tooltip, phím tắt Ctrl+N/F/R/Escape.

---

### BƯỚC 1 — Tạo main-view.fxml

**Thao tác:** Chuột phải `resources/com/fucar/` → `New` → `File` → `main-view.fxml`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.geometry.Insets?>

<BorderPane xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="com.fucar.controller.MainController"
            stylesheets="@style.css"
            prefWidth="1024" prefHeight="680">

    <!-- TOP: MenuBar + ToolBar -->
    <top>
        <VBox>
            <MenuBar>
                <Menu text="Hệ thống">
                    <MenuItem text="Đăng nhập lại"/>
                    <MenuItem text="Đổi mật khẩu"/>
                    <SeparatorMenuItem/>
                    <MenuItem text="Thoát" onAction="#handleExit"/>
                </Menu>
                <Menu text="Quản lý">
                    <MenuItem text="Quản lý xe"            onAction="#navCars"/>
                    <MenuItem text="Quản lý khách hàng"    onAction="#navCustomers"/>
                    <MenuItem text="Giao dịch thuê xe"     onAction="#navRental"/>
                </Menu>
                <Menu text="Báo cáo">
                    <MenuItem text="Báo cáo theo kỳ"       onAction="#navReport"/>
                    <MenuItem text="Xuất Excel"/>
                </Menu>
                <Menu text="Trợ giúp">
                    <MenuItem text="Hướng dẫn sử dụng"/>
                    <MenuItem text="Về chúng tôi"/>
                </Menu>
            </MenuBar>

            <ToolBar>
                <Button fx:id="btnCars"      text="🚗 Quản lý xe"  onAction="#navCars"/>
                <Button fx:id="btnCustomers" text="👤 Quản lý KH"   onAction="#navCustomers"/>
                <Button fx:id="btnRental"    text="📋 Giao dịch"   onAction="#navRental"/>
                <Button fx:id="btnReport"    text="📊 Báo cáo"     onAction="#navReport"/>
                <Separator/>
                <Region HBox.hgrow="ALWAYS"/>
                <Label fx:id="lblUser"
                       text="Xin chào, Admin"
                       style="-fx-font-weight:bold;-fx-padding:0 10 0 0;"/>
            </ToolBar>
        </VBox>
    </top>

    <!-- LEFT: Accordion menu -->
    <left>
        <VBox prefWidth="200"
              style="-fx-background-color:#1A237E;">
            <Label text="MENU CHÍNH"
                   maxWidth="Infinity" alignment="CENTER"
                   style="-fx-font-weight:bold;-fx-text-fill:white;
                          -fx-padding:12;-fx-font-size:13px;"/>
            <Accordion fx:id="accordion">
                <TitledPane text="🗂 Quản lý">
                    <VBox spacing="2" style="-fx-padding:4 0;">
                        <Button text="  🚗 Quản lý xe"      styleClass="nav-button"
                                maxWidth="Infinity" onAction="#navCars"/>
                        <Button text="  👤 Quản lý KH"      styleClass="nav-button"
                                maxWidth="Infinity" onAction="#navCustomers"/>
                        <Button text="  📋 Giao dịch"       styleClass="nav-button"
                                maxWidth="Infinity" onAction="#navRental"/>
                    </VBox>
                </TitledPane>
                <TitledPane text="📊 Báo cáo">
                    <VBox spacing="2" style="-fx-padding:4 0;">
                        <Button text="  📅 Báo cáo kỳ"      styleClass="nav-button"
                                maxWidth="Infinity" onAction="#navReport"/>
                        <Button text="  📈 Thống kê tổng"   styleClass="nav-button"
                                maxWidth="Infinity"/>
                    </VBox>
                </TitledPane>
                <TitledPane text="⚙ Cài đặt">
                    <VBox spacing="2" style="-fx-padding:4 0;">
                        <Button text="  🔑 Đổi mật khẩu"    styleClass="nav-button"
                                maxWidth="Infinity"/>
                        <Button text="  ℹ Thông tin hệ thống" styleClass="nav-button"
                                maxWidth="Infinity"/>
                    </VBox>
                </TitledPane>
            </Accordion>
        </VBox>
    </left>

    <!-- CENTER: StackPane chứa các màn hình -->
    <center>
        <StackPane fx:id="contentArea">
            <VBox alignment="CENTER" spacing="16">
                <Label text="Chào mừng đến với FUCarRentingSystem"
                       style="-fx-font-size:22px;-fx-font-weight:bold;-fx-text-fill:#1F4E79;"/>
                <Label text="Chọn chức năng từ menu bên trái"
                       style="-fx-font-size:14px;-fx-text-fill:#757575;"/>
            </VBox>
        </StackPane>
    </center>

    <!-- BOTTOM: StatusBar -->
    <bottom>
        <HBox style="-fx-background-color:#E3F2FD;-fx-padding:4 10;"
              alignment="CENTER_LEFT" spacing="10">
            <Label fx:id="lblStatus" text="Sẵn sàng"
                   style="-fx-text-fill:#555;"/>
            <Region HBox.hgrow="ALWAYS"/>
            <Label fx:id="lblDateTime"
                   style="-fx-text-fill:#555;"/>
        </HBox>
    </bottom>
</BorderPane>
```

**✅ Kiểm tra:**
- [ ] Mở Scene Builder: thấy BorderPane với top/left/center/bottom đủ
- [ ] Accordion có 3 TitledPane
- [ ] `fx:id="contentArea"` cho StackPane

---

### BƯỚC 2 — Tạo MainController.java

**Thao tác:** Chuột phải `com.fucar.controller` → `New` → `Java Class` → `MainController`.

```java
package com.fucar.controller;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.fxml.*;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.util.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class MainController {

    @FXML private StackPane contentArea;
    @FXML private Label     lblStatus, lblDateTime;
    @FXML private Button    btnCars, btnCustomers, btnRental, btnReport;

    private static final DateTimeFormatter DT_FMT =
        DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    @FXML
    public void initialize() {
        startClock();
        setupToolbarTooltips();
    }

    /** Đồng hồ cập nhật mỗi giây */
    private void startClock() {
        Timeline clock = new Timeline(
            new KeyFrame(Duration.seconds(1), e ->
                lblDateTime.setText(LocalDateTime.now().format(DT_FMT))
            )
        );
        clock.setCycleCount(Timeline.INDEFINITE);
        clock.play();
        lblDateTime.setText(LocalDateTime.now().format(DT_FMT));
    }

    /** Tooltip cho các nút ToolBar */
    private void setupToolbarTooltips() {
        addTooltip(btnCars,      "Quản lý xe (Ctrl+1)");
        addTooltip(btnCustomers, "Quản lý khách hàng (Ctrl+2)");
        addTooltip(btnRental,    "Giao dịch thuê xe (Ctrl+3)");
        addTooltip(btnReport,    "Báo cáo thống kê (Ctrl+4)");
    }

    private void addTooltip(Button btn, String text) {
        Tooltip tip = new Tooltip(text);
        tip.setShowDelay(Duration.millis(300));
        tip.getStyleClass().add("tooltip");
        btn.setTooltip(tip);
    }

    // ── Navigation ──────────────────────────────────────────
    @FXML private void navCars()      { showPlaceholder("📋 Màn hình Quản lý Xe"); }
    @FXML private void navCustomers() { showPlaceholder("👤 Màn hình Quản lý KH"); }
    @FXML private void navRental()    { showPlaceholder("📋 Màn hình Giao Dịch"); }
    @FXML private void navReport()    { showPlaceholder("📊 Màn hình Báo Cáo"); }
    @FXML private void handleExit()   { Platform.exit(); }

    private void showPlaceholder(String title) {
        Label lbl = new Label(title);
        lbl.setStyle("-fx-font-size:20px;-fx-font-weight:bold;-fx-text-fill:#1F4E79;");
        contentArea.getChildren().setAll(lbl);
        lblStatus.setText("Đang hiển thị: " + title);
    }
}
```

---

### BƯỚC 3 — Đăng ký phím tắt trong MainApp

Trong `MainApp.start()`, sau khi tạo Scene:

```java
Scene scene = new Scene(loader.load(), 1024, 680);
scene.getStylesheets().add(
    MainApp.class.getResource("/com/fucar/style.css").toExternalForm());

// Phím tắt toàn cục
scene.setOnKeyPressed(event -> {
    MainController ctrl = loader.getController();
    switch (event.getCode()) {
        case N -> { if (event.isControlDown()) ctrl.navCars(); }
        case F -> { if (event.isControlDown()) {
            // Focus vào ô tìm kiếm của màn hình hiện tại
            scene.lookup("#searchField") instanceof javafx.scene.control.TextField tf
                ? tf.requestFocus() : null;
        }}
        case R -> { if (event.isControlDown()) ctrl.navReport(); }
        case ESCAPE -> {
            // Đóng dialog đang mở (nếu có)
            javafx.stage.Stage.getWindows().stream()
                .filter(w -> w.isShowing() && w instanceof javafx.stage.Stage s
                             && s != stage)
                .findFirst().ifPresent(javafx.stage.Window::hide);
        }
    }
});

stage.setTitle("FUCarRentingSystem v1.0");
stage.setScene(scene);
stage.show();
```

**✅ Kiểm tra sau NC5:**
- [ ] App khởi động: BorderPane đủ top/left/center/bottom
- [ ] MenuBar có 4 menu, "Thoát" gọi `Platform.exit()`
- [ ] Accordion menu trái: 3 TitledPane mở/đóng được
- [ ] Hover lên nút ToolBar → Tooltip hiện sau ~300ms
- [ ] Đồng hồ ở StatusBar cập nhật mỗi giây
- [ ] Ctrl+N → navCars() được gọi
- [ ] Ctrl+F → ô searchField được focus (nếu màn hình có)
- [ ] Escape → đóng dialog đang mở

---

## PHẦN 12 — LỖI THƯỜNG GẶP & CÁCH SỬA

| Lỗi | Nguyên nhân | Cách sửa |
|-----|------------|---------|
| `NullPointerException` trên biến `@FXML` | `fx:id` trong FXML không khớp tên biến Java (case-sensitive) | Kiểm tra lại từng cặp `fx:id` ↔ `@FXML` |
| `Location is not set` | Đường dẫn `getResource()` sai hoặc file FXML không có trong build | Rebuild project; đảm bảo file `.fxml` trong `resources/` |
| `ControllerValue is null` | `fx:controller` sai full class name | Kiểm tra package + class name chính xác |
| `PropertyValueFactory` không hiển thị | Thiếu getter theo convention `getFieldName()` | Thêm getter đúng tên |
| Method `@FXML` không được gọi | Tên trong `onAction="#methodName"` không khớp | Kiểm tra tên method, phải có annotation `@FXML` |
| Scene Builder không nhận `fx:controller` | Chưa build project, class chưa compile | `Build` → `Rebuild Project` trước khi mở Scene Builder |
| `IllegalStateException` khi load FXML lần 2 | Dùng cùng 1 `FXMLLoader` instance để load lại | Tạo `new FXMLLoader(...)` mới mỗi lần mở dialog |

---

## PHẦN 13 — BẢNG TỔNG KẾT

| Bài | File FXML | Controller | Kỹ năng chính |
|-----|-----------|-----------|--------------|
| TH1 | `login-view.fxml` | `LoginController` | AnchorPane, PasswordField, CheckBox toggle |
| TH2 | `list-view.fxml` + `detail-view.fxml` | `ListController` + `DetailController` | TableView, FXMLLoader, Modality, truyền object |
| TH3 | `style.css` | (tất cả) | CSS file, styleClass, hover effect |
| NC1 | `car-dialog.fxml` | `CarDialogController` | Spinner, TextArea, RadioButton, inline error |
| NC2 | `customer-view.fxml` | `CustomerController` | ContextMenu, FilteredList, MULTIPLE select, Badge |
| NC3 | `rental-view.fxml` | `RentalController` | Property, DateCell, tổng tiền tự động |
| NC4 | `report-view.fxml` | `ReportController` | BarChart, LineChart, PieChart, summary cards |
| NC5 | `main-view.fxml` | `MainController` | Accordion, Tooltip, Timeline clock, phím tắt |

**Thứ tự thực hiện đề xuất:** TH1 → TH2 → TH3 → NC1 → NC2 → NC3 → NC4 → NC5
