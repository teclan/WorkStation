package com.znyw.service.imp;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.imp.EventDockDaoImp;
import com.znyw.service.EventDockService;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;
import com.znyw.websocket.websocketServer;

@Service
public class EventDockServiceImp implements EventDockService {
	private static final Logger LOGGER = LoggerFactory.getLogger(EventDockServiceImp.class);
	private static final SimpleDateFormat DATE_FORMATE = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	// @Resource
	@Autowired
	private EventDockDaoImp eventDockDaoImp;

	@Override
	@SuppressWarnings("unchecked")
	public JSONObject pushOwners(JSONArray array) {

		for (int i = 0; i < array.size(); i++) {
			Map<String, Object> namesAndValues = (Map<String, Object>) array.get(i);
			String userId = namesAndValues.get("userId").toString();

			boolean hasOwner = eventDockDaoImp.getOwnersByUserId(userId);

			boolean pushed = false;

			if (hasOwner) {
				namesAndValues.remove("userId");
				pushed = eventDockDaoImp.updateOwners(userId, namesAndValues);
				LOGGER.info("用户`{}`，已存在，将将对该用户进行数据更新", userId);
			} else {
				pushed = eventDockDaoImp.pushOwners(namesAndValues);
			}

			if (!pushed) {
				return ResultUtil.simpleResponse("500", "推送失败");
			}
		}
		return ResultUtil.simpleResponse("200", "推送成功");
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	@SuppressWarnings("unchecked")
	public JSONObject updateOwners(JSONArray array) {

		for (int i = 0; i < array.size(); i++) {
			Map<String, Object> namesAndValues = (Map<String, Object>) array.get(i);

			String userId = namesAndValues.remove("userId").toString();

			eventDockDaoImp.updateOwners(userId, namesAndValues);
		}

		return ResultUtil.simpleResponse("200", "更新完成");
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject ownerslist(JSONObject object) {

		JSONObject pageInfoP = object.getJSONObject("pageInfoPojo");
		int pageSize = pageInfoP.getIntValue("pageSize");
		int currPage = pageInfoP.getIntValue("currentPage");
		String sort = Objects.isNullString(pageInfoP.getString("sort")) ? "ASC"
				: pageInfoP.getString("sort").contains("ASC") ? "ASC" : "DESC";

		JSONObject queryTond = object.getJSONObject("queryTond");

		JSONArray userIdsArray = queryTond.getJSONArray("userIds");
		List<String> userIds = (List<String>) JSON.parse(userIdsArray.toJSONString());
		String userName = queryTond.getString("userName");
		String userAddr = queryTond.getString("userAddr");
		String areaName = queryTond.getString("areaName");
		String contact = queryTond.getString("contact");
		String cPhone = queryTond.getString("cPhone");
		String cMobile = queryTond.getString("cMobile");
		String pnlTel = queryTond.getString("pnlTel");
		String pnlHdTel = queryTond.getString("pnlHdTel");

		Map<String, Object> map = eventDockDaoImp.ownerslist(userIds, userName, userAddr, areaName, contact, cPhone,
				cMobile, pnlTel, pnlHdTel, sort, pageSize, currPage - 1);

		return createResponse(currPage, pageSize, map);
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject pushAlarmEvent(JSONObject jsonObject) {

		Map<String, Object> namesAndValues = (Map<String, Object>) JSON.parse(jsonObject.toJSONString());

		namesAndValues.put("recieiveTime", DATE_FORMATE.format(new Date()));

		String eventNum = namesAndValues.get("eventNum") == null ? null : namesAndValues.get("eventNum").toString();

		if (Objects.isNullString(eventNum)) {
			LOGGER.error("报警信息中缺失事件编号,推送失败:{}", jsonObject);
			return ResultUtil.simpleResponse("500", "推送失败");
		}

		// 如果已经收到过这个报警的推送，直接返回推送成功
		if (eventDockDaoImp.hasAlarmEvent(eventNum)) {
			LOGGER.info("报警 {} 已存在，推送成功...", eventNum);
			return ResultUtil.simpleResponse("200", "推送成功");
		}

		boolean added = eventDockDaoImp.pushAlarmEvent(namesAndValues);

		if (added) {

			if (namesAndValues.get("evtWay") == null || !"1".equals(namesAndValues.get("evtWay").toString())) {
				LOGGER.info("事件 `{}` 的事件归类为非报警类,不需要推送...", eventNum);
				return ResultUtil.simpleResponse("200", "推送成功");
			}
			List<String> eventNums = new ArrayList<String>();
			eventNums.add(namesAndValues.get("eventNum").toString());
			JSONArray array = JSONArray
					.parseArray(JSONObject.toJSONString(eventDockDaoImp.getAlarmEventByEventNum(eventNums)));
			websocketServer.sendAll(array.toJSONString());
			return ResultUtil.simpleResponse("200", "推送成功");
		} else {
			return ResultUtil.simpleResponse("500", "推送失败");
		}
	}

	@Override
	public JSONObject alarmEventslist(JSONObject jsonObject) {
		JSONObject pageInfoP = jsonObject.getJSONObject("pageInfoPojo");
		int pageSize = pageInfoP.getIntValue("pageSize");
		int currPage = pageInfoP.getIntValue("currentPage");
		String sort = pageInfoP.getString("sort");

		JSONObject queryTond = jsonObject.getJSONObject("queryTond");

		String eventNum = queryTond.getString("eventNum");
		String eventTime = queryTond.getString("eventTime");
		String evtWay = queryTond.getString("evtWay");
		String eventDesc = queryTond.getString("eventDesc");
		String codeTypeId = queryTond.getString("codeTypeId");
		String accountNum = queryTond.getString("accountNum");
		String accountName = queryTond.getString("accountName");
		String handleStatus = queryTond.getString("handleStatus");
		String handleResult = queryTond.getString("handleResult");
		String handleDesc = queryTond.getString("handleDesc");
		String handleTime = queryTond.getString("handleTime");

		Map<String, Object> map = eventDockDaoImp.alarmEventslist(eventNum, eventTime, evtWay, eventDesc, codeTypeId,
				accountNum, accountName, handleStatus, handleResult, handleDesc, handleTime, sort, pageSize,
				currPage - 1);

		return createResponse(currPage, pageSize, map);

	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject handleAlarmEvent(JSONObject jsonObject) {

		JSONArray eventNumArray = jsonObject.getJSONArray("eventNums");
		List<String> eventNums = (List<String>) JSON.parse(eventNumArray.toJSONString());

		String handleResult = jsonObject.getString("handleResult");
		String handleDesc = jsonObject.getString("handleDesc");
		String handleTime = DATE_FORMATE.format(new Date());

		List<String> alreadyHandledAlarmEvents = eventDockDaoImp.getAlreadyHandledAlarmEventIds(eventNums);

		// 所选事件中至少有一个事件已经被处理了
		if (Objects.isNotNull(alreadyHandledAlarmEvents)) {
			return ResultUtil.simpleResponse("500",
					String.format("操作失败，事件 %s 已被其他用户处理", Objects.Joiner(",", alreadyHandledAlarmEvents)));
		}

		boolean handled = eventDockDaoImp.handleAlarmEvent(eventNums, handleResult, handleDesc, handleTime);

		if (handled) {
			// 处理成功
			// TODO
			// 添加推送逻辑

			JSONArray array = JSONArray
					.parseArray(JSONObject.toJSONString(eventDockDaoImp.getAlarmEventByEventNum(eventNums)));
			websocketServer.sendAll(array.toJSONString());

			return ResultUtil.simpleResponse("200", "操作成功");
		} else {
			// 处理失败
			// TODO
			return ResultUtil.simpleResponse("500", "操作失败");
		}
	}

	@Override
	public List<String> getAllOwnerId() {
		return eventDockDaoImp.getAllOwnerId();
	}

	@SuppressWarnings("rawtypes")
	private JSONObject createResponse(int currentPage, int pageSizeInt, Map<String, Object> map) {
		List list = (List) map.get("lists");

		Integer totalNum = (Integer) map.get("totalNum");

		int totalPage;
		if (totalNum % pageSizeInt == 0) {
			totalPage = totalNum / pageSizeInt;
		} else {
			totalPage = totalNum / pageSizeInt + 1;
		}

		JSONObject Userjosn = new JSONObject();
		JSONObject result = new JSONObject();
		JSONObject pageInfoPojo = new JSONObject();

		result.put("message", "成功");
		result.put("code", 0);
		pageInfoPojo.put("pageSize", pageSizeInt);
		pageInfoPojo.put("totalNum", totalNum);
		pageInfoPojo.put("currentPage", currentPage);
		pageInfoPojo.put("totalPage", totalPage);
		Userjosn.put("result", result);
		Userjosn.put("json", list);
		Userjosn.put("pageInfoPojo", pageInfoPojo);

		return Userjosn;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	@Override
	public JSONObject updateEvent(JSONArray array) {

		// for (int i = 0; i < array.size(); ) {
		// String eventNum = ((JSONObject) array.get(i)).getString("eventNum");
		// if (eventDockDaoImp.hasAlarmEvent(eventNum)) {
		// LOGGER.info("事件 `{}` 已存在 ...", eventNum);
		// array.remove(i);
		// }else {
		// i++;
		// }
		// }

		eventDockDaoImp.updateEvent(array);

		return ResultUtil.simpleResponse("200", "更新完成");
	}
}
