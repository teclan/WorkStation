package com.znyw.ctrl;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.znyw.auth.HttpHelper;
import com.znyw.service.EventDockService;
import com.znyw.tool.HttpForward;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

/**
 * 查询相关的控制器
 * 
 * @author teclan
 *
 *         2017年12月19日
 */
@Controller
@RequestMapping("/")
public class QueryCtrl {
	private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

	@Resource
	private EventDockService eventDockService;

	/**
	 * 根据用户编号或编号列表查询用户简要信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/query/ownerslist")
	public JSONObject queryOwnerslist(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[查詢机主用户信息]  /query/ownerslist.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);

			JSONObject result = eventDockService.ownerslist(object);

			LOGGER.info("[查詢机主用户信息]  /query/ownerslist.do 返回:{}", result.getString("message"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/query/alarmEventslist")
	public JSONObject queryAlarmEvent(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpHelper.getBodyString(request);

			LOGGER.info("[查詢报警信息]  /query/alarmEventslist.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);

			JSONObject result = eventDockService.alarmEventslist(object);

			LOGGER.info("[查詢报警信息]  /query/alarmEventslist.do 返回:{}", result.getString("result"));

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 根据机主编号查询机主详细信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/getUserData")
	public JSONObject getUserData(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);
			LOGGER.info("[根据编号查询机主信息]  参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);

			try {
				String resp = HttpForward.SendToIMM("getUserData.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("[根据编号查询机主信息]  返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 根据机主编号查询机主详细信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("query/ownerInfoById")
	public JSONObject ownerInfoById(HttpServletRequest request, HttpServletResponse response) {
		return getUserData(request, response);

	}

	@ResponseBody
	@RequestMapping("/getCodeType")
	public JSONObject getCodeType(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpHelper.getBodyString(request);
			LOGGER.info(" /getCodeType.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);

			try {
				String resp = HttpForward.SendToIMM("getCodeTypeId.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info(" /getCodeType.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 根据机主编号查询联系人信息
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/getRelevantContact")
	public JSONObject getRelevantContact(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[根据机主编号查询联系人信息]  /getRelevantContact.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);
			try {
				String resp = HttpForward.SendToIMM("getRelevantContact.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("[根据机主编号查询联系人信息]  /getRelevantContact.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/getEquipmentData")
	public JSONObject getEquipmentData(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[根据机主编号查询相关设备信息]  /getEquipmentData.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);
			try {
				String resp = HttpForward.SendToIMM("getEquipmentData.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("[根据机主编号查询相关设备信息]  /getEquipmentData.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/getUserZone")
	public JSONObject getUserZone(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			LOGGER.info("[根据机主编号查询用户防区信息]  /getUserZone.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);

			try {
				String resp = HttpForward.SendToIMM("getUserZone.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("[根据机主编号查询用户防区信息]  /getUserZone.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/GetCameraListByUid")
	public JSONObject GetCameraListByUid(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[根据机主编号查询用户监控点信息]  /GetCameraListByUid.do 参数:{}", stringParam);

			JSONObject object = JSONObject.parseObject(stringParam);
			try {
				String resp = HttpForward.SendToIMM("GetCameraListByUid.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("[根据机主编号查询用户监控点信息]  /GetCameraListByUid.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/getCodeMemo")
	public JSONObject getCodeMemo(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);
			LOGGER.info(" /getCodeMemo.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);

			try {
				String resp = HttpForward.SendToIMM("getCodeMemo.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/getMapPicByRoleId")
	public JSONObject getMapPicByRoleId(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info(" /getMapPicByRoleId.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);
			try {
				String resp = HttpForward.SendToIMMPOST3("getMapPicByRoleId.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info(" /getMapPicByRoleId.do 返回:{}", result);
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/QueryDealwayListByUid")
	public JSONObject QueryDealwayListByUid(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpTool.readJSONString(request);
			LOGGER.info(" /QueryDealwayListByUid.do 参数:{}", stringParam);
			JSONObject object = JSONObject.parseObject(stringParam);

			try {
				String resp = HttpForward.SendToIMMPOST3("QueryDealwayListByUid.do", object.toJSONString());
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info(" /QueryDealwayListByUid.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("/eveType")
	public JSONObject eveType(HttpServletRequest request, HttpServletResponse response) {

		LOGGER.info(" /eveType.do ");
		try {
			String resp = HttpForward.SendToIMM("eveType.do", new JSONObject().toJSONString());
			JSONObject result = JSONObject.parseObject(resp);
			LOGGER.info(" /eveType.do 返回:{}", result);
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "请求管理平台错误!");
		}
	}

	@ResponseBody
	@RequestMapping("/eveDescribe")
	public JSONObject eveDescribe(HttpServletRequest request, HttpServletResponse response) {

		LOGGER.info(" /eveDescribe.do ");
		try {
			String resp = HttpForward.SendToIMM("eveDescribe.do", new JSONObject().toJSONString());
			JSONObject result = JSONObject.parseObject(resp);
			LOGGER.info(" /eveDescribe.do 返回:{}", result.getString("message"));
			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "请求管理平台错误!");
		}
	}

	@ResponseBody
	@RequestMapping("/getZoneByOwnerId")
	public JSONObject getZoneByOwnerId(HttpServletRequest request, HttpServletResponse response) {

		try {
			String stringParam = HttpHelper.getBodyString(request);
			LOGGER.info("获取防区  getZoneByOwnerId.do  参数:{}", stringParam);
			try {
				String resp = HttpForward.SendToIMMPOST3("getZoneByOwnerId.do", stringParam);
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("获取防区  /getZoneByOwnerId.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 通过设备的id获取设备和设备子系统的布撤防状态
	 * 
	 * @param request
	 * @param response
	 * @param json
	 * @return
	 */
	@RequestMapping("/getChildInfoByDevId")
	@ResponseBody
	public JSONObject getChildInfoByDevId(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpHelper.getBodyString(request);
			LOGGER.info("通过设备的id获取设备和设备子系统的布撤防状态  getChildInfoByDevId.do  参数:{}", stringParam);

			try {
				String resp = HttpForward.SendToIMM("UserStateMonitor/getChildInfoByDevId.do", stringParam);
				JSONObject result = JSONObject.parseObject(resp);
				LOGGER.info("/getChildInfoByDevId.do 返回:{}", result.getString("message"));
				return result;
			} catch (Exception e) {
				LOGGER.error(e.getMessage(), e);
				return ResultUtil.simpleResponse("500", "请求管理平台错误!");
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}

	}

}
