package com.znyw.service;

import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public interface EventDockService {

	JSONObject pushOwners(JSONArray array);

	JSONObject updateOwners(JSONArray array);

	JSONObject ownerslist(JSONObject object);

	JSONObject pushAlarmEvent(JSONObject jsonObject);

	JSONObject alarmEventslist(JSONObject jsonObject);

	JSONObject handleAlarmEvent(JSONObject jsonObject);

	List<String> getAllOwnerId();


}
