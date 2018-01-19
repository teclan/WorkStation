package com.znyw.ctrl;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.auth.HttpHelper;
import com.znyw.service.EventDockService;
import com.znyw.tool.HttpForward;
import com.znyw.tool.Objects;
import com.znyw.tool.ResultUtil;

/**
 * 对接服务控制器，提供给对接服务的相关接口
 * 
 * @author teclan
 *
 *         2017年12月19日
 */
@Controller
@RequestMapping("/eventDock")
public class EventDockCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private EventDockService eventDockService;

	/**
	 * 推送机主信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/pushOwners")
	public JSONObject pushOwners(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[对接服务推送机主用户信息]  /eventDock/pushOwners.do 参数:{}", stringParam);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			JSONArray array = jsonObject.getJSONArray("userBriefs");

			JSONObject result = eventDockService.pushOwners(array);

			LOGGER.info("[对接服务推送机主用户信息]  /eventDock/pushOwners.do 返回:{}", result.getString("message"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/pushAlarmEvent")
	public JSONObject pushAlarmEvent(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[对接服务推送报警信息]  /eventDock/pushAlarmEvent.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);

			JSONObject result = eventDockService.pushAlarmEvent(object);

			LOGGER.info("[对接服务推送报警信息]  /eventDock/pushAlarmEvent.do 返回:{}", result.getString("message"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 处理事件
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/handleAlarmEvent")
	public JSONObject handleAlarmEvent(HttpServletRequest request, HttpServletResponse response) {
		try {

			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[处理报警信息]  /eventDock/handleAlarmEvent.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);

			JSONObject result = eventDockService.handleAlarmEvent(object);

			LOGGER.info("[处理报警信息]  /eventDock/handleAlarmEvent.do 返回:{}", result.getString("message"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 通过用户编号更新机主信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/updateOwners")
	public JSONObject updateOwners(HttpServletRequest request, HttpServletResponse response) {
		try {

			JSONObject object = new JSONObject();
			JSONObject result = new JSONObject();

			List<String> userIds = eventDockService.getAllOwnerId();
			int pageSize = 1000;

			int totalPages = (int) Math.ceil((userIds.size() * 1.0 / pageSize));

			for (int i = 1; i <= totalPages; i++) {
				object.put("userIds", userIds.subList((i - 1) * pageSize,
						i * pageSize > userIds.size() ? userIds.size() : i * pageSize));

				try {
					LOGGER.info("更新机主信息,请求第 {} 页,共 {} 页 ", i, totalPages);
					String resp = HttpForward.SendToAbutmentServerUrl("abutment/getUserInfoByUserIds.do",
							object.toJSONString());
					LOGGER.info("更新机主信息,事件对接返回第 {} 页 ,共 {} 页 ", i, totalPages);
					object = JSONObject.parseObject(resp);
				} catch (Exception e) {
					LOGGER.error(e.getMessage(), e);
					return ResultUtil.simpleResponse("500", "请求事件对接服务错误！");
				}

				JSONArray array = object.getJSONArray("userBriefs");
				result = eventDockService.updateOwners(array);
				LOGGER.info("更新机主信息,工作站处理第 {} 页完成 ,共 {} 页 ", i, totalPages);
			}
			LOGGER.info("[通过用户编号更新机主信息]  /eventDock/updateOwners.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 根据用户编号或编号列表查询用户简要信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/ownerslist")
	public JSONObject queryOwnerslist(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[查詢机主用户信息]  /query/ownerslist.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);

			JSONObject result = eventDockService.ownerslist(object);

			LOGGER.info("[查詢机主用户信息]  /query/ownerslist.do 返回:{}", result.getString("result"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 更新事件信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/updateEvent")
	public JSONObject updateEvent(HttpServletRequest request, HttpServletResponse response) {
		try {
			JSONObject object = new JSONObject();
			JSONObject result = new JSONObject();

			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[更新报警信息]  /eventDock/updateEvent.do 参数:{}", stringParam);

			JSONObject objectParam = JSONObject.parseObject(stringParam);

			object.put("timeStart", Objects.isNullString(objectParam.getString("startTime")) ? ""
					: objectParam.getString("startTime").replace("T", " "));
			object.put("timeEnd", Objects.isNullString(objectParam.getString("endTime")) ? ""
					: objectParam.getString("endTime").replace("T", " "));

			object.put("stationHost",
					Objects.isNullString(objectParam.getString("stationHost")) ? request.getLocalAddr()
							: objectParam.getString("stationHost"));
			object.put("stationPort",
					Objects.isNullString(objectParam.getString("stationPort")) ? request.getLocalPort()
							: objectParam.getString("stationPort"));
			// 默认先请求第一页数据，如果后续还有数据，则依次按页请求数据并更新
			object.put("pageSize", 1000);
			object.put("currentPage", 1);

			try {
				LOGGER.info("事件更新，请求第 {} 页", 1);
				String resp = HttpForward.SendToAbutmentServerUrl("abutment/syncAlarmEvent.do", object.toJSONString());
				LOGGER.info("事件更新，事件对接返回第 {} 页", 1);
				if (Objects.isNullString(resp)) {
					return ResultUtil.simpleResponse("500", "同步已完成！");
				}
				JSONObject responseObject = JSONObject.parseObject(resp);

				int totalPages = responseObject.getIntValue("totalPages");
				int currentPage = responseObject.getIntValue("currentPage");

				JSONArray array = responseObject.getJSONArray("alertPojos");

				result = eventDockService.updateEvent(array);
				LOGGER.info("事件更新工作站处理第 {} 页完成", 1);

				while (currentPage < totalPages) {
					currentPage++;
					object.put("currentPage", currentPage);

					LOGGER.info("事件更新，请求第 {} 页，共 {} 页", currentPage, totalPages);
					resp = HttpForward.SendToAbutmentServerUrl("abutment/syncAlarmEvent.do", object.toJSONString());
					LOGGER.info("事件更新，事件对接返回第 {} 页", currentPage);

					if (Objects.isNullString(resp)) {
						return ResultUtil.simpleResponse("500", "同步已完成！");
					}
					responseObject = JSONObject.parseObject(resp);

					totalPages = responseObject.getIntValue("totalPages");
					currentPage = responseObject.getIntValue("currentPage");

					array = responseObject.getJSONArray("alertPojos");
					result = eventDockService.updateEvent(array);
					LOGGER.info("事件更新工作站处理第 {} 页完成", currentPage);
				}
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求事件对接服务错误！");
			}

			LOGGER.info("[通过时间更新报警信息]  /eventDock/updateEvent.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/getUserStateListByWorkStation")
	public JSONObject getUserStateListByWorkStation(HttpServletRequest request, HttpServletResponse response) {
		try {
			JSONObject object = new JSONObject();
			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[查询状态]  /eventDock/getUserStateListByWorkStation.do 参数:{}", stringParam);

			JSONObject objectParam = JSONObject.parseObject(stringParam);
			objectParam.put("userIds", eventDockService.getAllOwnerId());

			LOGGER.info("[查询状态]  /eventDock/getUserStateListByWorkStation.do 参数:{}", objectParam.toJSONString());

			try {
				String resp = HttpForward.SendToIMM("UserStateMonitor/getUserStateListByWorkStation.do",
						objectParam.toJSONString());
				object = JSONObject.parseObject(resp);
				return object;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求事件对接服务错误！");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}
}
