package core

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	common_const "muidea.com/magicCommon/common"
	common_def "muidea.com/magicCommon/def"
	"muidea.com/magicCommon/foundation/net"
)

func (s *Share) createAction(res http.ResponseWriter, req *http.Request) {
	log.Print("createAction")

	param := &common_def.BatchCreateMediaParam{}
	result := common_def.BatchCreateMediaResult{}
	for {
		authToken := req.URL.Query().Get(common_const.AuthToken)
		sessionID := req.URL.Query().Get(common_const.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("createAction, create medias failed, illegal authToken or sessionID")
			result.ErrorCode = common_def.Failed
			result.Reason = "无效Token或会话"
			break
		}

		err := net.ParsePostJSON(req, param)
		if err != nil {
			log.Printf("createAction, ParsePostJSON failed, err:%s", err.Error())
			result.ErrorCode = common_def.Failed
			result.Reason = "非法请求"
			break
		}

		medias, ok := s.centerAgent.BatchCreateMedia(param.Medias, param.Description, param.Catalog, param.Expiration, authToken, sessionID)
		if !ok {
			log.Print("createAction, create medias failed")
			result.ErrorCode = common_def.Failed
			result.Reason = "新建文件记录失败"
			break
		}

		result.ErrorCode = common_def.Success
		result.Medias = medias
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) viewAction(res http.ResponseWriter, req *http.Request) {
	log.Print("viewAction")

	result := common_def.QueryMediaResult{}
	for {
		authToken := req.URL.Query().Get(common_const.AuthToken)
		sessionID := req.URL.Query().Get(common_const.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("viewAction, query media failed, illegal authToken or sessionID")
			result.ErrorCode = common_def.Failed
			result.Reason = "无效Token或会话"
			break
		}
		_, value := net.SplitRESTAPI(req.URL.Path)
		id, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("viewAction, query media failed, illegal id, id:%s, err:%s", value, err.Error())
			result.ErrorCode = common_def.Failed
			result.Reason = "非法参数"
			break
		}

		media, ok := s.centerAgent.QueryMedia(id, authToken, sessionID)
		if !ok {
			log.Print("viewAction, query media failed, illegal id or no exist")
			result.ErrorCode = common_def.NoExist
			result.Reason = "对象不存在"
			break
		}

		result.Media = media
		result.ErrorCode = common_def.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) deleteAction(res http.ResponseWriter, req *http.Request) {
	log.Print("deleteAction")

	result := common_def.DestroyMediaResult{}
	for {
		authToken := req.URL.Query().Get(common_const.AuthToken)
		sessionID := req.URL.Query().Get(common_const.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("deleteAction, delete media failed, illegal authToken or sessionID")
			result.ErrorCode = common_def.Failed
			result.Reason = "无效Token或会话"
			break
		}

		_, value := net.SplitRESTAPI(req.URL.Path)
		id, err := strconv.Atoi(value)
		if err != nil {
			log.Printf("deleteAction, strconv.Atoi failed, err:%s", err.Error())
			result.ErrorCode = common_def.IllegalParam
			result.Reason = "非法参数"
			break
		}

		ok := s.centerAgent.DeleteMedia(id, authToken, sessionID)
		if !ok {
			log.Printf("deleteAction, delete media failed, id=%d", id)
			result.ErrorCode = common_def.Failed
			result.Reason = "删除对象失败"
			break
		}

		result.ErrorCode = common_def.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}
