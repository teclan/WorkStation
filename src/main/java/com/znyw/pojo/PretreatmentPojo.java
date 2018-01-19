package com.znyw.pojo;

/**
 *处警单实例化对象 
 * @author lc
 **/

public class PretreatmentPojo {
	String disposalAlarmNum = "";//处警编号
	String eventNum = "";//关联事件编号（选填）
	String disposalAlarmFType = "";//处警单类型（系统处警、转110、手动处警）
	String disposer = "";//处理人（操作员编号）、接警员
	String createTime = "";//创建时间
	String isFinish = "";//isFinish
	String wayType = "";//处理方式，处警/核警
	String accountNum = "";//用户编号
	String hostNum = "";//主机账号
	String accountName = "";//用户名称
	String isPayName = "";//缴费状态（是/否）
	String centerName = "";//所属中心
	String accountAddr = "";//用户地址
	String contact = "";//负责人
	// String internetTel = "";//联网电话
	String faultRemind = "";//故障提示
	String cPhone = "";//负责人电话
	String wirelessTel = "";//无线卡号
	String annotation = "";//处警注释
	String cMobile = "";//负责人手机
	String payNO = "";//负责人口令
	String codeType = "";//事件类型
	String eventDesc = "";//事件描述
	String eventTime = "";//事件时间
	String zoneNum = "";//防区编号
	String zoneAddr = "";//防区位置
	String snModelName = "";//探头型号
	String devModelName = "";//设备型号
	String acceptAlarmTime = "";//接警时间
	String disposalTeamHead = "";//处警队负责人
	String dispatchType = "";//出警方式
	String dispatchers = "";//处警人
	String acceptAlarmer = "";//接警人
	String arriveTime = "";//到达现场时间
	String dispatchUnit = "";//出警单位1
	String dispatchUnit2 = "";//出警单位2
	String arriveUsedTime = "";//到达用时
	String returnTime = "";//返回时间
	String disposalTeamHead1 = "";//处警队负责人1
	String disposalTeamHead2 = "";//处警队负责人2
	String alarmAnalyze = "";//报警分析
	String disposalAlarmTime = "";//处警时间1
	String disposalAlarmTime2 = "";//处警时间2
	String actualSituation = "";//实际警情
	String disposalAlarmResult = "";//处警结果
	String memo = "";//备注
	String snType ="";//探头类型
	String usrAlmType= "";//用户级别
	String alarmAddr= "";//报警地址
	private String pnlTel = "";// 联网电话
	private String dispatchEndTime = "";// 结束时间
	private String assignTime;// 派警时间
	private String feedback;// 现场反馈
	private String waitForFeedback = "0";
	
	public String getWaitForFeedback() {
		return waitForFeedback;
	}

	public void setWaitForFeedback(String waitForFeedback) {
		this.waitForFeedback = waitForFeedback;
	}
	public String getDisposalAlarmNum() {
		return disposalAlarmNum;
	}
	public void setDisposalAlarmNum(String disposalAlarmNum) {
		this.disposalAlarmNum = disposalAlarmNum;
	}
	public String getEventNum() {
		return eventNum;
	}
	public void setEventNum(String eventNum) {
		this.eventNum = eventNum;
	}
	public String getDisposalAlarmFType() {
		return disposalAlarmFType;
	}
	public void setDisposalAlarmFType(String disposalAlarmFType) {
		this.disposalAlarmFType = disposalAlarmFType;
	}
	public String getDisposer() {
		return disposer;
	}
	public void setDisposer(String disposer) {
		this.disposer = disposer;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getIsFinish() {
		return isFinish;
	}
	public void setIsFinish(String isFinish) {
		this.isFinish = isFinish;
	}
	public String getWayType() {
		return wayType;
	}
	public void setWayType(String wayType) {
		this.wayType = wayType;
	}
	public String getAccountNum() {
		return accountNum;
	}
	public void setAccountNum(String accountNum) {
		this.accountNum = accountNum;
	}
	public String getHostNum() {
		return hostNum;
	}
	public void setHostNum(String hostNum) {
		this.hostNum = hostNum;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getIsPayName() {
		return isPayName;
	}
	public void setIsPayName(String isPayName) {
		this.isPayName = isPayName;
	}
	public String getCenterName() {
		return centerName;
	}
	public void setCenterName(String centerName) {
		this.centerName = centerName;
	}
	public String getAccountAddr() {
		return accountAddr;
	}
	public void setAccountAddr(String accountAddr) {
		this.accountAddr = accountAddr;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getFaultRemind() {
		return faultRemind;
	}
	public void setFaultRemind(String faultRemind) {
		this.faultRemind = faultRemind;
	}
	public String getcPhone() {
		return cPhone;
	}
	public void setcPhone(String cPhone) {
		this.cPhone = cPhone;
	}
	public String getWirelessTel() {
		return wirelessTel;
	}
	public void setWirelessTel(String wirelessTel) {
		this.wirelessTel = wirelessTel;
	}
	
	public String getDevModelName() {
		return devModelName;
	}
	public void setDevModelName(String devModelName) {
		this.devModelName = devModelName;
	}
	public String getAcceptAlarmer() {
		return acceptAlarmer;
	}
	public void setAcceptAlarmer(String acceptAlarmer) {
		this.acceptAlarmer = acceptAlarmer;
	}
	public String getAnnotation() {
		return annotation;
	}
	public void setAnnotation(String annotation) {
		this.annotation = annotation;
	}
	public String getCMobile() {
		return cMobile;
	}
	public void setCMobile(String cMobile) {
		this.cMobile = cMobile;
	}
	public String getPayNO() {
		return payNO;
	}
	public void setPayNO(String PayNO) {
		this.payNO = PayNO;
	}
	public String getCodeType() {
		return codeType;
	}
	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}
	public String getEventDesc() {
		return eventDesc;
	}
	public void setEventDesc(String eventDesc) {
		this.eventDesc = eventDesc;
	}
	public String getEventTime() {
		return eventTime;
	}
	public void setEventTime(String eventTime) {
		this.eventTime = eventTime;
	}
	public String getZoneNum() {
		return zoneNum;
	}
	public void setZoneNum(String zoneNum) {
		this.zoneNum = zoneNum;
	}
	public String getZoneAddr() {
		return zoneAddr;
	}
	public void setZoneAddr(String zoneAddr) {
		this.zoneAddr = zoneAddr;
	}
	public String getSnModelName() {
		return snModelName;
	}
	public void setSnModelName(String snModelName) {
		this.snModelName = snModelName;
	}
	public String getAcceptAlarmTime() {
		return acceptAlarmTime;
	}
	public void setAcceptAlarmTime(String acceptAlarmTime) {
		this.acceptAlarmTime = acceptAlarmTime;
	}
	
	public String getDispatchType() {
		return dispatchType;
	}
	public void setDispatchType(String dispatchType) {
		this.dispatchType = dispatchType;
	}
	public String getDispatchers() {
		return dispatchers;
	}
	public void setDispatchers(String dispatchers) {
		this.dispatchers = dispatchers;
	}
	public String getArriveTime() {
		return arriveTime;
	}
	public void setArriveTime(String arriveTime) {
		this.arriveTime = arriveTime;
	}
	public String getDispatchUnit() {
		return dispatchUnit;
	}
	public void setDispatchUnit(String dispatchUnit) {
		this.dispatchUnit = dispatchUnit;
	}
	public String getDispatchUnit2() {
		return dispatchUnit2;
	}
	public void setDispatchUnit2(String dispatchUnit2) {
		this.dispatchUnit2 = dispatchUnit2;
	}
	public String getArriveUsedTime() {
		return arriveUsedTime;
	}
	public void setArriveUsedTime(String arriveUsedTime) {
		this.arriveUsedTime = arriveUsedTime;
	}
	public String getReturnTime() {
		return returnTime;
	}
	public void setReturnTime(String returnTime) {
		this.returnTime = returnTime;
	}
	public String getDisposalTeamHead() {
		return disposalTeamHead;
	}
	public void setDisposalTeamHead(String disposalTeamHead) {
		this.disposalTeamHead = disposalTeamHead;
	}
	public String getDisposalTeamHead1() {
		return disposalTeamHead1;
	}
	public void setDisposalTeamHead1(String disposalTeamHead1) {
		this.disposalTeamHead1 = disposalTeamHead1;
	}
	public String getDisposalTeamHead2() {
		return disposalTeamHead2;
	}
	public void setDisposalTeamHead2(String disposalTeamHead2) {
		this.disposalTeamHead2 = disposalTeamHead2;
	}
	public String getAlarmAnalyze() {
		return alarmAnalyze;
	}
	public void setAlarmAnalyze(String alarmAnalyze) {
		this.alarmAnalyze = alarmAnalyze;
	}
	public String getDisposalAlarmTime() {
		return disposalAlarmTime;
	}
	public void setDisposalAlarmTime(String disposalAlarmTime) {
		this.disposalAlarmTime = disposalAlarmTime;
	}
	public String getDisposalAlarmTime2() {
		return disposalAlarmTime2;
	}
	public void setDisposalAlarmTime2(String disposalAlarmTime2) {
		this.disposalAlarmTime2 = disposalAlarmTime2;
	}
	public String getActualSituation() {
		return actualSituation;
	}
	public void setActualSituation(String actualSituation) {
		this.actualSituation = actualSituation;
	}
	public String getDisposalAlarmResult() {
		return disposalAlarmResult;
	}
	public void setDisposalAlarmResult(String disposalAlarmResult) {
		this.disposalAlarmResult = disposalAlarmResult;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getSnType() {
		return snType;
	}
	public void setSnType(String snType) {
		this.snType = snType;
	}
	public String getUsrAlmType() {
		return usrAlmType;
	}
	public void setUsrAlmType(String usrAlmType) {
		this.usrAlmType = usrAlmType;
	}
	public String getAlarmAddr() {
		return alarmAddr;
	}
	public void setAlarmAddr(String alarmAddr) {
		this.alarmAddr = alarmAddr;
	}

	public String getcMobile() {
		return cMobile;
	}

	public void setcMobile(String cMobile) {
		this.cMobile = cMobile;
	}

	public String getPnlTel() {
		return pnlTel;
	}

	public void setPnlTel(String pnlTel) {
		this.pnlTel = pnlTel;
	}

	public String getDispatchEndTime() {
		return dispatchEndTime;
	}

	public void setDispatchEndTime(String dispatchEndTime) {
		this.dispatchEndTime = dispatchEndTime;
	}

	public String getAssignTime() {
		return assignTime;
	}

	public void setAssignTime(String assignTime) {
		this.assignTime = assignTime;
	}
	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}
	@Override
	public String toString() {
		return "PretreatmentPojo [disposalAlarmNum=" + disposalAlarmNum
				+ ", eventNum=" + eventNum + ", disposalAlarmFType="
				+ disposalAlarmFType + ", disposer=" + disposer
				+ ", createTime=" + createTime + ", isFinish=" + isFinish
				+ ", wayType=" + wayType + ", accountNum=" + accountNum
				+ ", hostNum=" + hostNum + ", accountName=" + accountName
				+ ", isPayName=" + isPayName + ", centerName=" + centerName
				+ ", accountAddr=" + accountAddr + ", contact=" + contact
				+ ", faultRemind="
				+ faultRemind + ", cPhone=" + cPhone + ", wirelessTel="
				+ wirelessTel + ", annotation=" + annotation + ", cMobile="
				+ cMobile + ", payNO=" + payNO + ", codeType=" + codeType
				+ ", eventDesc=" + eventDesc + ", eventTime=" + eventTime
				+ ", zoneNum=" + zoneNum + ", zoneAddr=" + zoneAddr
				+ ", snModelName=" + snModelName + ", devModelName="
				+ devModelName + ", acceptAlarmTime=" + acceptAlarmTime
				+ ", disposalTeamHead=" + disposalTeamHead + ", dispatchType="
				+ dispatchType + ", dispatchers=" + dispatchers
				+ ", acceptAlarmer=" + acceptAlarmer + ", arriveTime="
				+ arriveTime + ", dispatchUnit=" + dispatchUnit
				+ ", dispatchUnit2=" + dispatchUnit2 + ", arriveUsedTime="
				+ arriveUsedTime + ", returnTime=" + returnTime
				+ ", disposalTeamHead1=" + disposalTeamHead1
				+ ", disposalTeamHead2=" + disposalTeamHead2
				+ ", alarmAnalyze=" + alarmAnalyze + ", disposalAlarmTime="
				+ disposalAlarmTime + ", disposalAlarmTime2="
				+ disposalAlarmTime2 + ", actualSituation=" + actualSituation
				+ ", disposalAlarmResult=" + disposalAlarmResult + ", memo="
				+ memo + ", snType=" + snType + ", usrAlmType=" + usrAlmType
				+ ", alarmAddr=" + alarmAddr + ", pnlTel=" + pnlTel + ", dispatchEndTime=" + dispatchEndTime
				+ ", assignTime=" + assignTime
				+ ", feedback=" + feedback + "]";
	}
	
	
	
}
