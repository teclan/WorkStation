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
import com.znyw.auth.AuthenticateService;
import com.znyw.tool.HttpTool;
import com.znyw.tool.ResultUtil;

@Controller
@RequestMapping("/")
public class AuthenticateCtrl {
	private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticateCtrl.class);

	@Resource
	private AuthenticateService authenticateService;

	/**
	 * 登录
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("login")
	public JSONObject login(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[登录]  /login.do 参数:{}", stringParam);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			JSONObject result = authenticateService.login(jsonObject.getString("userName"),
					jsonObject.getString("password"));

			LOGGER.info("[登录]  /login.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	/**
	 * 退出
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("logout")
	public JSONObject logout(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[登录]  /logout.do 参数:{}", stringParam);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			JSONObject result = authenticateService.logout(jsonObject.getString("userName"),
					jsonObject.getString("token"));

			LOGGER.info("[登录]  /logout.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}

	@ResponseBody
	@RequestMapping("changePwd")
	public JSONObject changePwd(HttpServletRequest request, HttpServletResponse response) {
		try {
			String stringParam = HttpTool.readJSONString(request);

			LOGGER.info("[修改密码]  /changePwd.do 参数:{}", stringParam);

			JSONObject jsonObject = JSONObject.parseObject(stringParam);

			JSONObject result = authenticateService.changePwd(jsonObject.getString("userName"),
					jsonObject.getString("oldPwd"), jsonObject.getString("newPwd"));

			LOGGER.info("[修改密码]  /changePwd.do 返回:{}", result);

			return result;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return ResultUtil.simpleResponse("500", "参数格式错误");
		}
	}
}
