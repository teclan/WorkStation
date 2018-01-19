package com.znyw.pojo;
import java.util.List;

import com.alibaba.fastjson.JSONObject;


/**
 * 用户-警情实例化对象 
 * @author lc
 **/

public class AlertPojo {
	String handleStatus ="";//用户编号（系统用户）
	String handleResult ="";//事件编号(日期+随机数)
	String sysuserID ="";//用户编号（系统用户）
	String eventNum ="";//事件编号(日期+随机数)
	String eventTime ="";//事件时间
	String evtWay ="";//事件归类
	String eventLevel ="";//事件等级
	String eventDesc ="";//事件描述
	String eventSrc ="";//事件来源
	String receiveTime ="";//事件接收时间
	String sysCode = "";//系统码
	String codeTypeId = "";//系统码编号
	String codeType = "";//系统码编号类型
	String accountNum ="";//用户编号（机主）（店家）
	String accountName ="";//用户名称
	String accountAddr ="";//用户地址
	String accountZone ="";//用户防区
	String devId ="";//设备编号
	String devZoneId ="";//设备防区
	String devModelName ="";//设备型号
	String zoneAtPos ="";//防区位置
	String snType ="";//探头类型
	String almType ="";//警情类型
	String wantDo ="";//反应类型
	String isCallAbnor ="";//来电异常
	String callID ="";//来电显示
	String areaId ="";//区域编号
	String areaName ="";//区域名称
	String snModelName ="";//探头型号
	String disposeType ="";//（无、处警、核警、维修）0\1\2\3
	String disposer ="";//处理人（操作员编号）
	String disposeTime ="";//处理时间
	//String disposeID ="";//处理结果（处警编号、维修编号）
	String disposeStatus ="0";//（未处理、已处理、预处理）0\1\2
	String isOOZ = "0";//是否转发110（0-否、1-是）
	String maintainNum = "";//维修单号（有单号，无单号“”）
	String disposalAlarmNum = "";//处警单号（有单号，无单号“”）
	String verifyNum = "";//核警单号（有单号，无单号“”）
	String isBill = "0";//是否有单据
	String usrAlmType= "";//用户级别
	String devSubSys= "";//设备子系统
	String cameraName= "";//摄像机名称
	String userMonitorId= "";//用户监控点编号
	String cameraModelId= "";//监控点编号
	String atPos= "";//摄像机位置
	String alarmAddr= "";//报警位置
	private String isReturnDAF = "-1";// 处警单是否返回结果（0没有返回、1返回、2已查看）
	private String isReturnMF = "-1"; // 维修单是否返回结果（0没有返回、1返回、2已查看）
	/**
	 * 处置角色
	 */
	private String handeler;
	/**
	 * 查看角色
	 */
	private List<String> browser;
	
	/**
	 * 是否推送至联网报警
	 */
	private Integer isPush = 1;
	private String docResult = "";//单据结果
	private String docResultId = "0";//单据结果id（核警、处警、维修）0\1\2

	public List<String> getBrowser() {
		return browser;
	}
	public void setBrowser(List<String> browser) {
		this.browser = browser;
	}
	public String getDocResultId() {
		return docResultId;
	}
	public void setDocResultId(String docResultId) {
		this.docResultId = docResultId;
	}
	public String getHandleStatus() {
		return handleStatus;
	}
	public void setHandleStatus(String handleStatus) {
		this.handleStatus = handleStatus;
	}

	public String getHandleResult() {
		return handleResult;
	}
	public void setHandleResult(String handleResult) {
		this.handleResult = handleResult;
	}
	public String getDocResult() {
		return docResult;
	}
	public void setDocResult(String docResult) {
		this.docResult = docResult;
	}
	public String getUsrAlmType() {
		return usrAlmType;
	}
	public void setUsrAlmType(String usrAlmType) {
		this.usrAlmType = usrAlmType;
	}
	public String getDevSubSys() {
		return devSubSys;
	}
	public void setDevSubSys(String devSubSys) {
		this.devSubSys = devSubSys;
	}
	public String getCameraName() {
		return cameraName;
	}
	public void setCameraName(String cameraName) {
		this.cameraName = cameraName;
	}
	public String getUserMonitorId() {
		return userMonitorId;
	}
	public void setUserMonitorId(String userMonitorId) {
		this.userMonitorId = userMonitorId;
	}
	public String getCameraModelId() {
		return cameraModelId;
	}
	public void setCameraModelId(String cameraModelId) {
		this.cameraModelId = cameraModelId;
	}
	public String getAtPos() {
		return atPos;
	}
	public void setAtPos(String atPos) {
		this.atPos = atPos;
	}
	public String getIsBill() {
		return isBill;
	}
	public void setIsBill(String isBill) {
		this.isBill = isBill;
	}
	public String getSysuserID() {
		return sysuserID;
	}
	public void setSysuserID(String sysuserID) {
		this.sysuserID = sysuserID;
	}
	public String getEventNum() {
		return eventNum;
	}
	public void setEventNum(String eventNum) {
		this.eventNum = eventNum;
	}
	public String getEventTime() {
		return eventTime;
	}
	public void setEventTime(String eventTime) {
		this.eventTime = eventTime;
	}
	
	public String getEvtWay() {
		return evtWay;
	}
	public void setEvtWay(String evtWay) {
		this.evtWay = evtWay;
	}
	public String getEventLevel() {
		return eventLevel;
	}
	public void setEventLevel(String eventLevel) {
		this.eventLevel = eventLevel;
	}
	public String getEventDesc() {
		return eventDesc;
	}
	public void setEventDesc(String eventDesc) {
		this.eventDesc = eventDesc;
	}
	public String getEventSrc() {
		return eventSrc;
	}
	public void setEventSrc(String eventSrc) {
		this.eventSrc = eventSrc;
	}
	public String getReceiveTime() {
		return receiveTime;
	}
	public void setReceiveTime(String receiveTime) {
		this.receiveTime = receiveTime;
	}
	
	public String getSysCode() {
		return sysCode;
	}
	public void setSysCode(String sysCode) {
		this.sysCode = sysCode;
	}
	public String getCodeTypeId() {
		return codeTypeId;
	}
	public void setCodeTypeId(String codeTypeId) {
		this.codeTypeId = codeTypeId;
	}
	public String getCodeType() {
		return codeType;
	}
	public void setCodeType(String codeType) {
		this.codeType = codeType;
	}
	public String getAccountNum() {
		return accountNum;
	}
	public void setAccountNum(String accountNum) {
		this.accountNum = accountNum;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getAccountAddr() {
		return accountAddr;
	}
	public void setAccountAddr(String accountAddr) {
		this.accountAddr = accountAddr;
	}
	public String getAccountZone() {
		return accountZone;
	}
	public void setAccountZone(String accountZone) {
		this.accountZone = accountZone;
	}
	public String getDevId() {
		return devId;
	}
	public void setDevId(String devId) {
		this.devId = devId;
	}
	public String getDevZoneId() {
		return devZoneId;
	}
	public void setDevZoneId(String devZoneId) {
		this.devZoneId = devZoneId;
	}
	public String getDevModelName() {
		return devModelName;
	}
	public void setDevModelName(String devModelName) {
		this.devModelName = devModelName;
	}
	public String getZoneAtPos() {
		return zoneAtPos;
	}
	public void setZoneAtPos(String zoneAtPos) {
		this.zoneAtPos = zoneAtPos;
	}
	public String getSnType() {
		return snType;
	}
	public void setSnType(String snType) {
		this.snType = snType;
	}
	public String getAlmType() {
		return almType;
	}
	public void setAlmType(String almType) {
		this.almType = almType;
	}
	public String getWantDo() {
		return wantDo;
	}
	public void setWantDo(String wantDo) {
		this.wantDo = wantDo;
	}
	public String getIsCallAbnor() {
		return isCallAbnor;
	}
	public void setIsCallAbnor(String isCallAbnor) {
		this.isCallAbnor = isCallAbnor;
	}
	public String getCallID() {
		return callID;
	}
	public void setCallID(String callID) {
		this.callID = callID;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getSnModelName() {
		return snModelName;
	}
	public void setSnModelName(String snModelName) {
		this.snModelName = snModelName;
	}
	public String getDisposeType() {
		return disposeType;
	}
	public void setDisposeType(String disposeType) {
		this.disposeType = disposeType;
	}
	public String getDisposer() {
		return disposer;
	}
	public void setDisposer(String disposer) {
		this.disposer = disposer;
	}
	public String getDisposeTime() {
		return disposeTime;
	}
	public void setDisposeTime(String disposeTime) {
		this.disposeTime = disposeTime;
	}
	public String getDisposeStatus() {
		return disposeStatus;
	}
	public void setDisposeStatus(String disposeStatus) {
		this.disposeStatus = disposeStatus;
	}
	public String getIsOOZ() {
		return isOOZ;
	}
	public void setIsOOZ(String isOOZ) {
		this.isOOZ = isOOZ;
	}
	
	public String getMaintainNum() {
		return maintainNum;
	}
	public void setMaintainNum(String maintainNum) {
		this.maintainNum = maintainNum;
	}
	public String getDisposalAlarmNum() {
		return disposalAlarmNum;
	}
	public void setDisposalAlarmNum(String disposalAlarmNum) {
		this.disposalAlarmNum = disposalAlarmNum;
	}
	public String getVerifyNum() {
		return verifyNum;
	}
	public void setVerifyNum(String verifyNum) {
		this.verifyNum = verifyNum;
	}
	public String getAlarmAddr() {
		return alarmAddr;
	}
	public void setAlarmAddr(String alarmAddr) {
		this.alarmAddr = alarmAddr;
	}

	public String getIsReturnDAF() {
		return isReturnDAF;
	}

	public void setIsReturnDAF(String isReturnDAF) {
		this.isReturnDAF = isReturnDAF;
	}

	public String getIsReturnMF() {
		return isReturnMF;
	}

	public void setIsReturnMF(String isReturnMF) {
		this.isReturnMF = isReturnMF;
	}
	
	public Integer getIsPush() {
		return isPush;
	}
	public void setIsPush(Integer isPush) {
		this.isPush = isPush;
	}
	public String getHandeler() {
		return handeler;
	}
	public void setHandeler(String handeler) {
		this.handeler = handeler;
	}
	public AlertPojo() {
	}
	
	public AlertPojo(String sysuserID,String eventNum,String eventTime,String evtWay,
			String eventLevel,String eventDesc,String eventSrc,String receiveTime,String sysCode,String codeTypeId,
			String codeType,String accountNum,String accountName,String accountAddr,String accountZone,
			String devId,String devZoneId,String devModelName,String zoneAtPos,
			String snType,String almType,String wantDo,String isCallAbnor,String callID,
			String areaId,String areaName,String snModelName,String usrAlmType,
			String devSubSys,String cameraName,String userMonitorId,String cameraModelId,String atPos, String alarmAddr,List<String> browser,String handeler) {
		this.sysuserID = sysuserID;
		this.eventNum = eventNum;
		this.eventTime = eventTime;
		this.evtWay =evtWay;//事件归类
		this.eventLevel =eventLevel;//事件等级
		this.eventDesc =eventDesc;//事件描述
		this.eventSrc =eventSrc;//事件来源
		this.receiveTime =receiveTime;//事件接收时间
		this.sysCode = sysCode;//系统码
		this.codeTypeId = codeTypeId;//系统码类型编号	
		this.codeType = codeType;//系统码类型
		this.accountNum =accountNum;//用户编号（机主）（店家）
		this.accountName =accountName;//用户名称
		this.accountAddr =accountAddr;//用户地址
		this.accountZone =accountZone;//用户防区
		this.devId =devId;//设备编号
		this.devZoneId =devZoneId;//设备防区
		this.devModelName =devModelName;//设备型号
		this.zoneAtPos =zoneAtPos;//防区位置
		this.snType =snType;//探头类型
		this.almType =almType;//警情类型
		this.wantDo =wantDo;//反应类型
		this.isCallAbnor =isCallAbnor;//来电异常
		this.callID =callID;//来电显示
		this.areaId =areaId;//区域编号
		this.areaName =areaName;//区域名称
		this.snModelName =snModelName;//探头型号
		this.usrAlmType= usrAlmType;//用户级别
		this.devSubSys= devSubSys;//设备子系统
		this.cameraName= cameraName;//摄像机名称
		this.userMonitorId= userMonitorId;//用户监控点编号
		this.cameraModelId= cameraModelId;//监控点编号
		this.atPos= atPos;//摄像机位置
		this.alarmAddr = alarmAddr;//报警位置
		this.handeler = handeler;
		this.browser = browser;
	}
	
	
}
