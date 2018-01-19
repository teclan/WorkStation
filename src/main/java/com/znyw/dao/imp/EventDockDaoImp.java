package com.znyw.dao.imp;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.znyw.dao.EventDockDao;
import com.znyw.tool.Objects;
import com.znyw.tool.SqlGenerateUtils;

@Repository
public class EventDockDaoImp implements EventDockDao {
	private static final Logger LOGGER = LoggerFactory.getLogger(EventDockDaoImp.class);
	private static final SimpleDateFormat DATE_FORMATE = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	private static final String INSERT_WS_OWNERS_SQL = "insert into ws_owners %s";
	private static final String UPDATE_WS_OWNERS_SQL = "update ws_owners set %s where userId='%s'";
	private static final String INSERT_WS_ALARM_EVENT_SQL = "insert into ws_alarm_event %s";
	private static final String UPDATE_WS_ALARM_EVENT_SQL = "update ws_alarm_event set handleStatus='已处理',handleResult=?,handleDesc=?,handleTime=? where eventNum in ('%s') ";

	private static List<String> ALARM_EVENT_COLUMNS;

	static {
		ALARM_EVENT_COLUMNS = new ArrayList<String>();

		ALARM_EVENT_COLUMNS.add("eventNum");
		ALARM_EVENT_COLUMNS.add("eventTime");
		ALARM_EVENT_COLUMNS.add("eventLevel");
		ALARM_EVENT_COLUMNS.add("evtWay");
		ALARM_EVENT_COLUMNS.add("eventDesc");
		ALARM_EVENT_COLUMNS.add("recieiveTime");
		ALARM_EVENT_COLUMNS.add("sysCode");
		ALARM_EVENT_COLUMNS.add("codeTypeId");
		ALARM_EVENT_COLUMNS.add("accountNum");
		ALARM_EVENT_COLUMNS.add("accountName");
		ALARM_EVENT_COLUMNS.add("accountAddr");
		ALARM_EVENT_COLUMNS.add("accountZone");
		ALARM_EVENT_COLUMNS.add("usrAlmType");
		ALARM_EVENT_COLUMNS.add("devSubSys");
		ALARM_EVENT_COLUMNS.add("userMonitorId");
		ALARM_EVENT_COLUMNS.add("cameraModelId");
		ALARM_EVENT_COLUMNS.add("alarmAddr");
		ALARM_EVENT_COLUMNS.add("atPos");
		ALARM_EVENT_COLUMNS.add("devId");
		ALARM_EVENT_COLUMNS.add("devZoneId");
		ALARM_EVENT_COLUMNS.add("devModelName");
		ALARM_EVENT_COLUMNS.add("zoneAtPos");
		ALARM_EVENT_COLUMNS.add("snType");
		ALARM_EVENT_COLUMNS.add("almType");
		ALARM_EVENT_COLUMNS.add("wantDo");
		ALARM_EVENT_COLUMNS.add("areaId");
		ALARM_EVENT_COLUMNS.add("areaName");
		ALARM_EVENT_COLUMNS.add("snModelName");
		ALARM_EVENT_COLUMNS.add("codeType");
		ALARM_EVENT_COLUMNS.add("eventSrc");
	}

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public boolean pushOwners(Map<String, Object> namesAndValues) {
		try {

			int added = jdbcTemplate.update(
					String.format(INSERT_WS_OWNERS_SQL, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues));

			return added > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;
	}

	@Override
	public boolean updateOwners(String userId, Map<String, Object> namesAndValues) {
		try {
			String updateSql = String.format(UPDATE_WS_OWNERS_SQL,
					SqlGenerateUtils.generateSqlForUpdate(namesAndValues), userId);
			Object[] paras = SqlGenerateUtils.getNewValuesForUpdate(namesAndValues);

			jdbcTemplate.update(updateSql, paras);
			return true;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;

	}

	@Override
	@SuppressWarnings("deprecation")
	public boolean getOwnersByUserId(String userId) {

		String sql = "select count(*) from ws_owners where userId=?";

		try {
			return jdbcTemplate.queryForInt(sql, userId) > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			return false;
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public Map<String, Object> ownerslist(List<String> userIds, String userName, String userAddr, String areaName,
			String contact, String cPhone, String cMobile, String pnlTel, String pnlHdTel, String sort, int pageSize,
			int currPage) {

		userName = Objects.isNullString(userName) ? "" : String.format(" and locate('%s',userName)>0 ", userName);
		userAddr = Objects.isNullString(userAddr) ? "" : String.format(" and locate('%s',userAddr)>0 ", userAddr);
		areaName = Objects.isNullString(areaName) ? "" : String.format(" and locate('%s',areaName)>0 ", areaName);
		contact = Objects.isNullString(contact) ? "" : String.format(" and locate('%s',contact)>0 ", contact);
		cPhone = Objects.isNullString(cPhone) ? "" : String.format(" and locate('%s',cPhone)>0 ", cPhone);
		cMobile = Objects.isNullString(cMobile) ? "" : String.format(" and locate('%s',userName)>0 ", cMobile);
		pnlTel = Objects.isNullString(pnlTel) ? "" : String.format(" and locate('%s',pnlTel)>0 ", pnlTel);
		pnlHdTel = Objects.isNullString(pnlHdTel) ? "" : String.format(" and locate('%s',userName)>0 ", pnlHdTel);

		String queryCountSql = "";
		String queryDataSql = "";

		if (Objects.isNull(userIds)) {
			queryCountSql = "select count(*) from ws_owners where 1=1 " + userName + userAddr + areaName + contact
					+ cPhone + cMobile + cMobile + pnlTel + pnlHdTel;

			queryDataSql = "select * from ws_owners where 1=1 " + userName + userAddr + areaName + contact + cPhone
					+ cMobile + cMobile + pnlTel + pnlHdTel + " order by userId " + sort + " limit "
					+ (currPage * pageSize) + "," + pageSize;

		} else {
			queryCountSql = "select count(*) from ws_owners where userId in ('" + Objects.Joiner("','", userIds) + "') "
					+ userName + userAddr + areaName + contact + cPhone + cMobile + cMobile + pnlTel + pnlHdTel;

			queryDataSql = "select * from ws_owners where userId in ('" + Objects.Joiner("','", userIds) + "') "
					+ userName + userAddr + areaName + contact + cPhone + cMobile + cMobile + pnlTel + pnlHdTel
					+ " order by userId " + sort + " limit " + (currPage * pageSize) + "," + pageSize;

		}

		int totalNum = 0;
		List<Map<String, Object>> lists = new ArrayList<Map<String, Object>>();
		try {

			totalNum = jdbcTemplate.queryForInt(queryCountSql);
			lists = jdbcTemplate.queryForList(queryDataSql);

			Objects.setNull2EmptyString(lists);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			totalNum = 0;
			lists = new ArrayList<Map<String, Object>>();
		}

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("totalNum", totalNum);
		map.put("lists", lists);

		return map;
	}

	@Override
	public boolean pushAlarmEvent(Map<String, Object> namesAndValues) {

		Objects.removeUnnecessaryColumns(ALARM_EVENT_COLUMNS, namesAndValues);

		try {
			int added = jdbcTemplate.update(
					String.format(INSERT_WS_ALARM_EVENT_SQL, SqlGenerateUtils.generateSqlForInsert(namesAndValues)),
					SqlGenerateUtils.getInsertValues(namesAndValues));
			return added > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;
	}

	@Override
	@SuppressWarnings("deprecation")
	public Map<String, Object> alarmEventslist(String eventNum, String eventTime, String evtWay, String eventDesc,
			String codeTypeId, String accountNum, String accountName, String handleStatus, String handleResult,
			String handleDesc, String handleTime, String sort, int pageSize, int currPage) {

		String[] times = Objects.isNullString(eventTime) ? new String[] { "", "" } : eventTime.split(";");
		String timeStart = times[0];
		String timeEnd = times[1];

		String timeSql = "";
		// if (Objects.isNotNullString(timeStart)) {
		// timeSql += " AND eventTime > DATE_SUB('" + timeStart + "',INTERVAL 1 DAY) ";
		// }
		// if (Objects.isNotNullString(timeEnd)) {
		// timeSql += " AND eventTime < DATE_SUB('" + timeEnd + "',INTERVAL -1 DAY) ";
		// }

		if (Objects.isNotNullString(timeStart)) {
			timeSql += " AND eventTime > '" + timeStart + "' ";
		}
		if (Objects.isNotNullString(timeEnd)) {
			timeSql += " AND eventTime < '" + timeEnd + "' ";
		}

		eventNum = Objects.isNullString(eventNum) ? "" : String.format(" and locate('%s',eventNum)>0 ", eventNum);
		evtWay = Objects.isNullString(evtWay) ? "" : String.format(" and evtWay='%s' ", evtWay);
		eventDesc = Objects.isNullString(eventDesc) ? "" : String.format(" and locate('%s',sysCode)>0 ", eventDesc);
		codeTypeId = Objects.isNullString(codeTypeId) ? "" : String.format(" and codeTypeId='%s' ", codeTypeId);
		accountNum = Objects.isNullString(accountNum) ? ""
				: String.format(" and locate('%s',accountNum)>0 ", accountNum);
		accountName = Objects.isNullString(accountName) ? ""
				: String.format(" and locate('%s',accountName)>0 ", accountName);
		handleStatus = Objects.isNullString(handleStatus) ? ""
				: String.format(" and locate('%s',handleStatus)>0 ", handleStatus);
		handleResult = Objects.isNullString(handleResult) ? ""
				: String.format(" and locate('%s',handleResult)>0 ", handleResult);
		handleDesc = Objects.isNullString(handleDesc) ? ""
				: String.format(" and locate('%s',handleDesc)>0 ", handleDesc);
		handleTime = Objects.isNullString(handleTime) ? "" : String.format(" and locate('%s',eventNum)>0 ", handleTime);

		sort = Objects.isNullString(sort) ? "devId|ASC,eventTime|ASC" : sort;

		String devSortSql = "";
		String timeAndEventNumSort = "";
		if (sort.indexOf(",") > 0) {
			devSortSql = sort.split(",")[0].contains("ASC") ? "ASC" : "DESC";
			devSortSql = " devId " + devSortSql + " ,";
			timeAndEventNumSort = sort.split(",")[1].contains("ASC") ? "ASC" : "DESC";
		} else {
			timeAndEventNumSort = sort.contains("ASC") ? "ASC" : "DESC";
		}

		String queryCountSql = "select count(*) from ws_alarm_event where 1=1 " + eventNum + evtWay + eventDesc
				+ codeTypeId + accountNum + accountName + handleStatus + handleResult + handleDesc + handleTime
				+ timeSql;

		String queryDataSql = "select * from ws_alarm_event where 1=1 " + eventNum + evtWay + eventDesc + codeTypeId
				+ accountNum + accountName + handleStatus + handleResult + handleDesc + handleTime + timeSql
				+ " order by " + devSortSql + " eventTime " + timeAndEventNumSort + ",eventNum " + timeAndEventNumSort
				+ " limit " + (currPage * pageSize) + "," + pageSize;

		int totalNum = 0;
		List<Map<String, Object>> lists = new ArrayList<Map<String, Object>>();
		try {

			totalNum = jdbcTemplate.queryForInt(queryCountSql);
			lists = jdbcTemplate.queryForList(queryDataSql);

			Objects.setNull2EmptyString(lists);

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
			totalNum = 0;
			lists = new ArrayList<Map<String, Object>>();
		}

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("totalNum", totalNum);
		map.put("lists", lists);

		return map;
	}

	@Override
	@SuppressWarnings("deprecation")
	public boolean hasAlarmEvent(String eventNum) {
		String sql = "select count(*) from ws_alarm_event where eventNum=?";

		try {
			return jdbcTemplate.queryForInt(sql, eventNum) > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;
	}

	@Override
	public boolean handleAlarmEvent(List<String> eventNums, String handleResult, String handleDesc, String handleTime) {
		try {
			int added = jdbcTemplate.update(String.format(UPDATE_WS_ALARM_EVENT_SQL, Objects.Joiner("','", eventNums)),
					handleResult, handleDesc, handleTime);
			return added > 0;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;
	}

	@Override
	public List<String> getAllOwnerId() {

		String sql = "select userId from ws_owners";
		List<String> userIds = new ArrayList<String>();

		try {
			List<Map<String, Object>> lists = jdbcTemplate.queryForList(sql);

			if (Objects.isNotNull(lists)) {

				for (Map<String, Object> map : lists) {
					userIds.add(map.get("userId").toString());
				}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return userIds;
	}

	@Override
	public List<String> getAlreadyHandledAlarmEventIds(List<String> eventNums) {

		String sql = "select eventNum from ws_alarm_event where eventNum in ('%s') and handleStatus='已处理' ";

		List<String> alreadyHandledAlarmEvents = new ArrayList<String>();

		try {

			List<Map<String, Object>> lists = jdbcTemplate
					.queryForList(String.format(sql, Objects.Joiner("','", eventNums)));

			if (Objects.isNotNull(lists)) {

				for (Map<String, Object> map : lists) {
					alreadyHandledAlarmEvents.add(map.get("eventNum").toString());
				}
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}

		return alreadyHandledAlarmEvents;
	}

	@Override
	public List<Map<String, Object>> getAlarmEventByEventNum(List<String> eventNums) {
		String sql = "select * from ws_alarm_event where eventNum in ('%s')";

		try {

			List<Map<String, Object>> lists = jdbcTemplate
					.queryForList(String.format(sql, Objects.Joiner("','", eventNums)));

			if (Objects.isNotNull(lists)) {
				Objects.setNull2EmptyString(lists);
				return lists;
			}

		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return new ArrayList<Map<String, Object>>();
	}

	@Override
	public boolean updateEvent(final JSONArray array) {
		try {

			jdbcTemplate.batchUpdate(
					" insert into ws_alarm_event (sysCode,evtWay,accountNum,codeType,accountName,cameraModelId,zoneAtPos,snType,devZoneId,userMonitorId,codeTypeId,devSubSys,almType,eventDesc,eventLevel,areaName,eventTime,accountZone,snModelName,eventNum,devId,wantDo,accountAddr,atPos,devModelName,alarmAddr,areaId,usrAlmType,recieiveTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE sysCode=VALUES(sysCode)",
					new BatchPreparedStatementSetter() {

						@Override
						public void setValues(PreparedStatement ps, int i) throws SQLException {
							JSONObject object = (JSONObject) array.get(i);
							ps.setString(1, object.getString("sysCode"));
							ps.setString(2, object.getString("evtWay"));
							ps.setString(3, object.getString("accountNum"));
							ps.setString(4, object.getString("codeType"));
							ps.setString(5, object.getString("accountName"));
							ps.setString(6, object.getString("cameraModelId"));
							ps.setString(7, object.getString("zoneAtPos"));
							ps.setString(8, object.getString("snType"));
							ps.setString(9, object.getString("devZoneId"));
							ps.setString(10, object.getString("userMonitorId"));
							ps.setString(11, object.getString("codeTypeId"));
							ps.setString(12, object.getString("devSubSys"));
							ps.setString(13, object.getString("almType"));
							ps.setString(14, object.getString("eventDesc"));
							ps.setString(15, object.getString("eventLevel"));
							ps.setString(16, object.getString("areaName"));
							ps.setString(17, object.getString("eventTime"));
							ps.setString(18, object.getString("accountZone"));
							ps.setString(19, object.getString("snModelName"));
							ps.setString(20, object.getString("eventNum"));
							ps.setString(21, object.getString("devId"));
							ps.setString(22, object.getString("wantDo"));
							ps.setString(23, object.getString("accountAddr"));
							ps.setString(24, object.getString("atPos"));
							ps.setString(25, object.getString("devModelName"));
							ps.setString(26, object.getString("alarmAddr"));
							ps.setString(27, object.getString("areaId"));
							ps.setString(28, object.getString("usrAlmType"));
							ps.setString(29,
									Objects.isNullString(object.getString("recieiveTime"))
											? DATE_FORMATE.format(new Date())
											: object.getString("recieiveTime"));
						}

						@Override
						public int getBatchSize() {
							return array.size();
						}
					});
			return true;
		} catch (Exception e) {
			LOGGER.error(e.getMessage(), e);
		}
		return false;

	}
}
