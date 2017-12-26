package com.znyw.ctrl;

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

			LOGGER.info("[对接服务推送机主用户信息]  /eventDock/pushOwners.do 返回:{}", result);

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

			LOGGER.info("[对接服务推送报警信息]  /eventDock/pushAlarmEvent.do 返回:{}", result);

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

			LOGGER.info("[处理报警信息]  /eventDock/handleAlarmEvent.do 返回:{}", result);

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

			object.put("userIds", eventDockService.getAllOwnerId());

			String resp = HttpForward.SendToAbutmentServerUrl("abutment/getUserInfoByUserIds.do",
					object.toJSONString());

			LOGGER.info("[事件对接服务] 返回:{}", resp);

			object = JSONObject.parseObject(resp);

			JSONArray array = object.getJSONArray("userBriefs");

			JSONObject result = eventDockService.updateOwners(array);

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

			LOGGER.info("[查詢机主用户信息]  /query/ownerslist.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

}
