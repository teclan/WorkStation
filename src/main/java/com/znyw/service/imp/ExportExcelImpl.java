package com.znyw.service.imp;

import java.util.List;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSONArray;
import com.znyw.pojo.AlertPojo;
import com.znyw.pojo.PretreatmentPojo;
import com.znyw.pojo.UserInfoPojo;
import com.znyw.service.IExportExcel;
import com.znyw.tool.ExportExcel;
import com.znyw.tool.PropertyConfigUtil;

@Component
public class ExportExcelImpl implements IExportExcel {

	private static PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil
			.getInstance("properties/config.properties");

	@Override
	public Workbook eventExcel(List<AlertPojo> pojoList, Workbook wb, int i, JSONArray headers) {
		ExportExcel excel = new ExportExcel();
		String[] headerTotle = { "状态", "处理方式", "日期", "时间", "用户编号", "用户名称", "设备编号", "用户防区编号", "设备防区编号", "事件描述", "事件来源",
				"系统码", "用户级别", "事件编号", "用户地址", "事件类型", "防区位置", "探头类型", "探头型号", "设备型号", "警情类型", "反应类型", "来电异常", "来电显示",
				"所属区域", "设备子系统", "摄像机名称", "用户监控点编号", "监控点编号", "摄像机位置" };
		Workbook b = excel.exportEventExcel("Sheet", headerTotle, pojoList, wb, i);
		return b;
	}

	@Override
	public Workbook userInfoExcel(List<UserInfoPojo> pojoList, Workbook wb, int i, JSONArray headers) {
		ExportExcel excel = new ExportExcel();
		String[] headerTotle = { "用户编号", "用户名称", "用户地址", "单位负责人", "负责人电话", "负责人手机", "所属区域", "联网电话"};
		Workbook b = excel.exportUserInfoExcel("Sheet", headerTotle, pojoList, wb, i);
		return b;
	}

	@Override
	public Workbook pretreatmentExcel(List<PretreatmentPojo> pojoList, Workbook wb, int i, JSONArray headers,
			JSONArray result) {
		// TODO Auto-generated method stub
		return null;
	}
}
