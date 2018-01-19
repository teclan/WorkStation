package com.znyw.tool;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Workbook;

import com.znyw.pojo.AlertPojo;
import com.znyw.pojo.PretreatmentPojo;
import com.znyw.pojo.UserInfoPojo;

public class ExportExcel {
	PropertyConfigUtil propertyConfigUtil = PropertyConfigUtil.getInstance("properties/config.properties");

	public Workbook exportEventExcel(String fileName, String[] headers, List<AlertPojo> pojoList, Workbook wb,
			int num) {
		List<String> list = Arrays.asList(headers);
		int currentRowCount = 1;// 当前的行号
		// 声明一个工作薄
		HSSFWorkbook workbook = null;
		HSSFSheet sheet = null;
		if (wb == null) {
			workbook = new HSSFWorkbook();
			for (int i = num; i >= 1; i--) {
				sheet = workbook.createSheet(fileName + i);
				writeTitleContent(sheet, createTitleCellStyle(workbook), headers);// 写入标题
			}
		} else {
			workbook = (HSSFWorkbook) wb;
			for (int i = 1; i <= num; i++) {
				if (workbook.getSheet(fileName + i).getLastRowNum() <= propertyConfigUtil.getIntValue("sheet.num")
						- propertyConfigUtil.getIntValue("selectES.num")) {
					sheet = workbook.getSheet(fileName + i);
					break;
				} else {
					sheet = workbook.getSheet(fileName + (num + 1));
				}
			}
		}
		int bodyRowCount = sheet.getLastRowNum() + 1;// 正文内容行号
		HSSFRow row = null;// 创建一行
		try {
			// 向单元格里填充数据
			for (short i = 0; i < pojoList.size(); i++) {

				row = sheet.createRow(bodyRowCount);
				row.createCell(0).setCellValue(pojoList.get(i).getHandleStatus());// 状态
				row.createCell(1).setCellValue(pojoList.get(i).getHandleResult());// 单据结果
				row.createCell(2).setCellValue(pojoList.get(i).getEventTime().split("T")[0]);// 日期
				row.createCell(3).setCellValue(pojoList.get(i).getEventTime().split("T")[1]);// 时间
				row.createCell(4).setCellValue(pojoList.get(i).getAccountNum());// 用户编号
				row.createCell(5).setCellValue(pojoList.get(i).getAccountName());// 用户名称
				row.createCell(6).setCellValue(pojoList.get(i).getDevId());// 设备编号
				row.createCell(7).setCellValue(pojoList.get(i).getAccountZone());// 用户防区编号
				row.createCell(8).setCellValue(pojoList.get(i).getDevZoneId());// 设备防区编号
				row.createCell(9).setCellValue(pojoList.get(i).getEventDesc());// 事件描述
				row.createCell(10).setCellValue(pojoList.get(i).getEventSrc());// 事件来源
				row.createCell(11).setCellValue(pojoList.get(i).getSysCode());// 系统码
				if (pojoList.get(i).getUsrAlmType().equals("0")) {
					row.createCell(12).setCellValue("一级");// 用户级别
				} else if (pojoList.get(i).getUsrAlmType().equals("1")) {
					row.createCell(12).setCellValue("二级");// 用户级别
				} else if (pojoList.get(i).getUsrAlmType().equals("2")) {
					row.createCell(12).setCellValue("三级");// 用户级别
				} else if (pojoList.get(i).getUsrAlmType().equals("3")) {
					row.createCell(12).setCellValue("四级");// 用户级别
				} else if (pojoList.get(i).getUsrAlmType().equals("4")) {
					row.createCell(12).setCellValue("五级");// 用户级别
				}
				row.createCell(13).setCellValue(pojoList.get(i).getEventNum());// 事件编号
				row.createCell(14).setCellValue(pojoList.get(i).getAccountAddr());// 用户地址
				row.createCell(15).setCellValue(pojoList.get(i).getCodeType());// 事件类型
				row.createCell(16).setCellValue(pojoList.get(i).getZoneAtPos());// 防区位置
				row.createCell(17).setCellValue(pojoList.get(i).getSnType());// 探头类型
				row.createCell(18).setCellValue(pojoList.get(i).getSnModelName());// 探头型号
				row.createCell(19).setCellValue(pojoList.get(i).getDevModelName());// 设备型号
				row.createCell(20).setCellValue(pojoList.get(i).getAlmType());// 警情类型
				row.createCell(21).setCellValue(pojoList.get(i).getWantDo());// 反应类型
				row.createCell(22).setCellValue(pojoList.get(i).getIsCallAbnor());// 来电异常
				row.createCell(23).setCellValue(pojoList.get(i).getCallID());// 来电显示
				row.createCell(24).setCellValue(pojoList.get(i).getAreaName());// 所属区域
				row.createCell(25).setCellValue(pojoList.get(i).getDevSubSys());// 设备子系统
				row.createCell(26).setCellValue(pojoList.get(i).getCameraName());// 摄像机名称
				row.createCell(27).setCellValue(pojoList.get(i).getUserMonitorId());// 用户监控点编号
				row.createCell(28).setCellValue(pojoList.get(i).getCameraModelId());// 监控点编号
				row.createCell(29).setCellValue(pojoList.get(i).getAtPos());// 摄像机位置
				bodyRowCount++;// 正文内容行号递增1
				currentRowCount++;// 当前行号递增1

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return workbook;
	}

	public Workbook exportUserInfoExcel(String fileName, String[] headers, List<UserInfoPojo> pojoList, Workbook wb,
			int num) {
		List<String> list = Arrays.asList(headers);
		int currentRowCount = 1;// 当前的行号
		// 声明一个工作薄
		HSSFWorkbook workbook = null;
		HSSFSheet sheet = null;
		if (wb == null) {
			workbook = new HSSFWorkbook();
			for (int i = num; i >= 1; i--) {
				sheet = workbook.createSheet(fileName + i);
				writeTitleContent(sheet, createTitleCellStyle(workbook), headers);// 写入标题
			}
		} else {
			workbook = (HSSFWorkbook) wb;
			for (int i = 1; i <= num; i++) {
				if (workbook.getSheet(fileName + i).getLastRowNum() <= propertyConfigUtil.getIntValue("sheet.num")
						- propertyConfigUtil.getIntValue("selectES.num")) {
					sheet = workbook.getSheet(fileName + i);
					break;
				} else {
					sheet = workbook.getSheet(fileName + (num + 1));
				}
			}
		}
		int bodyRowCount = sheet.getLastRowNum() + 1;// 正文内容行号
		HSSFRow row = null;// 创建一行
		try {
			// 向单元格里填充数据
			for (short i = 0; i < pojoList.size(); i++) {

				row = sheet.createRow(bodyRowCount);
				row.createCell(0).setCellValue(pojoList.get(i).getUserId());// 状态
				row.createCell(1).setCellValue(pojoList.get(i).getUserName());// 单据结果
				row.createCell(2).setCellValue(pojoList.get(i).getUserAddr());// 日期
				row.createCell(3).setCellValue(pojoList.get(i).getContact());// 时间
				row.createCell(4).setCellValue(pojoList.get(i).getCPhone());// 用户编号
				row.createCell(5).setCellValue(pojoList.get(i).getCMobile());// 用户名称
				row.createCell(6).setCellValue(pojoList.get(i).getAreaName());// 设备编号
				row.createCell(7).setCellValue(pojoList.get(i).getPnlTel());// 用户防区编号
				bodyRowCount++;// 正文内容行号递增1
				currentRowCount++;// 当前行号递增1

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return workbook;
	}
	/**
	 * 设置表头
	 *
	 * @Author Li
	 * @param sheet
	 * @param headers
	 * @Date 2017年12月1日上午11:03:27
	 */
	public static void writeTitleContent(HSSFSheet sheet, HSSFCellStyle cellStyle, String[] headers) {
		HSSFRow row = null;// 创建一行
		HSSFCell cell = null;// 每个单元格
		row = sheet.createRow(0);
		// 设置表格默认列宽度为15个字节
		sheet.setDefaultColumnWidth((short) 20);
		for (short i = 0; i < headers.length; i++) {
			cell = row.createCell(i);
			cell.setCellValue(headers[i]);
			cell.setCellStyle(cellStyle);
		}
	}

	/**
	 * 设置标题单元样式
	 * 
	 * @param workbook
	 * @return
	 */
	public static HSSFCellStyle createTitleCellStyle(HSSFWorkbook workbook) {
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		HSSFFont font = workbook.createFont();
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		font.setFontHeightInPoints((short) 8);
		font.setFontName(HSSFFont.FONT_ARIAL);// 设置标题字体
		cellStyle.setFont(font);
		cellStyle = workbook.createCellStyle();
		cellStyle.setFont(font);// 设置列标题样式
		cellStyle.setFillForegroundColor(HSSFColor.SKY_BLUE.index);// 设置背景色
		cellStyle.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
		cellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 居中
		return cellStyle;
	}

}
