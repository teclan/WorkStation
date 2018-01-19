package com.znyw.pojo;

public class UserInfoPojo {
	String userId = "";//用户编号
	String userName = "";//用户名称
	String userAddr = "";//用户地址
	String contact = "";//单位负责人
	String cPhone = "";//负责人电话
	String cMobile = "";//负责人手机
	String areaName = "";//所属区域
	String pnlTel = "";//联网电话
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUserAddr() {
		return userAddr;
	}
	public void setUserAddr(String userAddr) {
		this.userAddr = userAddr;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	
	public String getCPhone() {
		return cPhone;
	}
	public void setCPhone(String cPhone) {
		this.cPhone = cPhone;
	}
	public String getCMobile() {
		return cMobile;
	}
	public void setCMobile(String cMobile) {
		this.cMobile = cMobile;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getPnlTel() {
		return pnlTel;
	}
	public void setPnlTel(String pnlTel) {
		this.pnlTel = pnlTel;
	}
	@Override
	public String toString() {
		return "userInfoPojo [userId=" + userId
				+ ", userName=" + userName + ", userAddr="
				+ userAddr + ", contact=" + contact
				+ ", cPhone=" + cPhone + ", cMobile=" + cMobile
				+ ", areaName=" + areaName + ", pnlTel=" + pnlTel+ "]";
	}
}
