package com.znyw.service;

import java.util.List;

import org.apache.poi.ss.usermodel.Workbook;

import com.alibaba.fastjson.JSONArray;
import com.znyw.pojo.AlertPojo;
import com.znyw.pojo.PretreatmentPojo;
import com.znyw.pojo.UserInfoPojo;

public interface IExportExcel {

	public Workbook pretreatmentExcel(List<PretreatmentPojo> pojoList, Workbook wb, int i, JSONArray headers,
			JSONArray result);

	public Workbook eventExcel(List<AlertPojo> pojoList, Workbook wb, int i, JSONArray headers);
	public Workbook userInfoExcel(List<UserInfoPojo> pojoList, Workbook wb, int i, JSONArray headers);
}
