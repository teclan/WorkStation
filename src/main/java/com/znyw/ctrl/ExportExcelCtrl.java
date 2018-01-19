package com.znyw.ctrl;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.pojo.AlertPojo;
import com.znyw.pojo.UserInfoPojo;
import com.znyw.service.EventDockService;
import com.znyw.service.IExportExcel;
import com.znyw.tool.PropertyConfigUtil;

@Controller
@RequestMapping("/ExportExcel/")
public class ExportExcelCtrl {

	@Resource
	private IExportExcel IExportExcel;

	@Resource
	private EventDockService eventDockService;

	PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil.getInstance("properties/config.properties");

	@RequestMapping(value = "EventExcel", method = RequestMethod.GET)
	@ResponseBody
	public String EventExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String jsonStr = request.getParameter("params");
		JSONObject jsonobjs = JSON.parseObject(jsonStr);
		JSONArray jsonArray = jsonobjs.getJSONArray("headers");
		jsonobjs.remove("headers");
		String rsResult = eventDockService.alarmEventslist(jsonobjs).toJSONString();
		if (rsResult == null) {
			return null;
		}
		JSONObject jsonObject = JSONObject.parseObject(rsResult);
		JSONObject pageInfo = jsonObject.getJSONObject("pageInfoPojo");
		int totalNum = Integer.parseInt(pageInfo.getString("totalNum"));
		int pageSize = Integer.parseInt(pageInfo.getString("pageSize"));
		Workbook wb = null;
		if (totalNum == 0) {
			return null;
		}
		int num = 1;
		if (totalNum % propertyConfigUtil.getIntValue("sheet.num") == 0) {
			num = totalNum / propertyConfigUtil.getIntValue("sheet.num");
		} else {
			num = (totalNum / propertyConfigUtil.getIntValue("sheet.num")) + 1;
		}
		if (pageSize >= totalNum) {
			List<AlertPojo> pojoList = JSON.parseArray(jsonObject.getString("json"), AlertPojo.class);
			Workbook wb1 = IExportExcel.eventExcel(pojoList, null, 1, jsonArray);
			if (wb1 != null) {
				response.reset();
				// 设置返回值信息
				response.setCharacterEncoding("UTF-8");
				response.setContentType("multipart/form-data");
				response.setHeader("Content-Disposition", "attachment;fileName="
						+ new String("事件查询".getBytes("UTF-8"), "ISO8859-1") + format.format(new Date()) + ".xls");
				response.addHeader("Accept-Ranges", "bytes");
				OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
				wb1.write(toClient);
				// toClient.write(wb);
				toClient.flush();
				toClient.close();
			}
			return null;
		} else {
			for (int i = 0; i < totalNum / propertyConfigUtil.getIntValue("selectES.num"); i++) {
				JSONObject newPageInfoPojo = jsonobjs.getJSONObject("pageInfoPojo");
				newPageInfoPojo.put("pageSize", propertyConfigUtil.getIntValue("selectES.num"));
				newPageInfoPojo.put("currentPage", i + 1 + "");
				jsonobjs.put("pageInfoPojo", newPageInfoPojo);
				String rs2 = eventDockService.alarmEventslist(jsonobjs).toJSONString();

				List<AlertPojo> pojoList = JSON.parseArray(JSONObject.parseObject(rs2).getString("json"),
						AlertPojo.class);
				// System.out.println(pojoList.size());
				wb = IExportExcel.eventExcel(pojoList, wb, num, jsonArray);
			}
			JSONObject newPageInfoPojo = jsonobjs.getJSONObject("pageInfoPojo");
			newPageInfoPojo.put("pageSize", totalNum - (propertyConfigUtil.getIntValue("selectES.num")
					* (totalNum / propertyConfigUtil.getIntValue("selectES.num"))));
			newPageInfoPojo.put("currentPage", (totalNum / propertyConfigUtil.getIntValue("selectES.num")) + 1 + "");
			String rs2 = eventDockService.alarmEventslist(jsonobjs).toJSONString();
			List<AlertPojo> pojoList = JSON.parseArray(JSONObject.parseObject(rs2).getString("json"),
					AlertPojo.class);
			wb = IExportExcel.eventExcel(pojoList, wb, num, jsonArray);
			if (wb != null) {
				response.reset();
				// 设置返回值信息
				response.setCharacterEncoding("UTF-8");
				response.setContentType("multipart/form-data");
				response.setHeader("Content-Disposition", "attachment;fileName="
						+ new String("事件查询".getBytes("UTF-8"), "ISO8859-1") + format.format(new Date()) + ".xls");
				response.addHeader("Accept-Ranges", "bytes");
				OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
				wb.write(toClient);
				// toClient.write(wb);
				toClient.flush();
				toClient.close();
			}
			return null;
		}

	}

	@RequestMapping(value = "UserInfoExcel", method = RequestMethod.GET)
	@ResponseBody
	public String UserInfoExcel(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		String jsonStr = request.getParameter("params");
		JSONObject jsonobjs = JSON.parseObject(jsonStr);
		JSONArray jsonArray = jsonobjs.getJSONArray("headers");
		jsonobjs.remove("headers");
		String rsResult = eventDockService.ownerslist(jsonobjs).toJSONString();
		if (rsResult == null) {
			return null;
		}
		JSONObject jsonObject = JSONObject.parseObject(rsResult);
		JSONObject pageInfo = jsonObject.getJSONObject("pageInfoPojo");
		int totalNum = Integer.parseInt(pageInfo.getString("totalNum"));
		int pageSize = Integer.parseInt(pageInfo.getString("pageSize"));
		Workbook wb = null;
		if (totalNum == 0) {
			return null;
		}
		int num = 1;
		if (totalNum % propertyConfigUtil.getIntValue("sheet.num") == 0) {
			num = totalNum / propertyConfigUtil.getIntValue("sheet.num");
		} else {
			num = (totalNum / propertyConfigUtil.getIntValue("sheet.num")) + 1;
		}
		if (pageSize >= totalNum) {
			List<UserInfoPojo> pojoList = JSON.parseArray(jsonObject.getString("json"), UserInfoPojo.class);
			Workbook wb1 = IExportExcel.userInfoExcel(pojoList, null, 1, jsonArray);
			if (wb1 != null) {
				response.reset();
				// 设置返回值信息
				response.setCharacterEncoding("UTF-8");
				response.setContentType("multipart/form-data");
				response.setHeader("Content-Disposition", "attachment;fileName="
						+ new String("用户信息".getBytes("UTF-8"), "ISO8859-1") + format.format(new Date()) + ".xls");
				response.addHeader("Accept-Ranges", "bytes");
				OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
				wb1.write(toClient);
				// toClient.write(wb);
				toClient.flush();
				toClient.close();
			}
			return null;
		} else {
			for (int i = 0; i < totalNum / propertyConfigUtil.getIntValue("selectES.num"); i++) {
				JSONObject newPageInfoPojo = jsonobjs.getJSONObject("pageInfoPojo");
				newPageInfoPojo.put("pageSize", propertyConfigUtil.getIntValue("selectES.num"));
				newPageInfoPojo.put("currentPage", i + 1 + "");
				jsonobjs.put("pageInfoPojo", newPageInfoPojo);

				String rs2 = eventDockService.ownerslist(jsonobjs).toJSONString();

				List<UserInfoPojo> pojoList = JSON.parseArray(JSONObject.parseObject(rs2).getString("json"),
						UserInfoPojo.class);
				// System.out.println(pojoList.size());
				wb = IExportExcel.userInfoExcel(pojoList, wb, num, jsonArray);
			}
			JSONObject newPageInfoPojo = jsonobjs.getJSONObject("pageInfoPojo");
			newPageInfoPojo.put("pageSize", totalNum - (propertyConfigUtil.getIntValue("selectES.num")
					* (totalNum / propertyConfigUtil.getIntValue("selectES.num"))));
			newPageInfoPojo.put("currentPage", (totalNum / propertyConfigUtil.getIntValue("selectES.num")) + 1 + "");
			String rs2 = eventDockService.ownerslist(jsonobjs).toJSONString();
			List<UserInfoPojo> pojoList = JSON.parseArray(JSONObject.parseObject(rs2).getString("json"),
					UserInfoPojo.class);
			wb = IExportExcel.userInfoExcel(pojoList, wb, num, jsonArray);
			if (wb != null) {
				response.reset();
				// 设置返回值信息
				response.setCharacterEncoding("UTF-8");
				response.setContentType("multipart/form-data");
				response.setHeader("Content-Disposition", "attachment;fileName="
						+ new String("用户信息".getBytes("UTF-8"), "ISO8859-1") + format.format(new Date()) + ".xls");
				response.addHeader("Accept-Ranges", "bytes");
				OutputStream toClient = new BufferedOutputStream(response.getOutputStream());
				wb.write(toClient);
				// toClient.write(wb);
				toClient.flush();
				toClient.close();
			}
			return null;
		}

	}
}
