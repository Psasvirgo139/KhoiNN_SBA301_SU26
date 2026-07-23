package com.example.A3NguyenNgocKhoi_SBA301.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BookingRequest {

    private Long customerID;
    private List<BookingDetailRequest> details;

    // Legacy fields for backward compatibility
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> roomIDs;

    public BookingRequest() {}

    public Long getCustomerID() {
        return customerID;
    }

    public void setCustomerID(Long customerID) {
        this.customerID = customerID;
    }

    public List<BookingDetailRequest> getDetails() {
        return details;
    }

    public void setDetails(List<BookingDetailRequest> details) {
        this.details = details;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<Long> getRoomIDs() {
        return roomIDs;
    }

    public void setRoomIDs(List<Long> roomIDs) {
        this.roomIDs = roomIDs;
    }

    public List<BookingDetailRequest> getNormalizedDetails() {
        if (details != null && !details.isEmpty()) {
            return details;
        }
        List<BookingDetailRequest> list = new ArrayList<>();
        if (roomIDs != null && startDate != null && endDate != null) {
            for (Long rId : roomIDs) {
                list.add(new BookingDetailRequest(rId, startDate, endDate));
            }
        }
        return list;
    }
}
