package core

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	common_const "muidea.com/magicCommon/common"
	common_def "muidea.com/magicCommon/def"
	"muidea.com/magicCommon/foundation/net"
	"muidea.com/magicCommon/model"
)

func (s *Share) createAction(res http.ResponseWriter, req *http.Request) {
	log.Print("createAction")

	type createParam struct {
		common_def.BatchCreateMediaParam
		Privacy model.Unit `json:"privacy"`
	}
	type createResult common_def.BatchCreateMediaResult

	param := &createParam{}
	result := createResult{}
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

		if param.Privacy.ID == s.shareView.ID {
			param.Catalog = append(param.Catalog, model.Catalog{ID: s.shareView.ID, Name: s.shareView.Name})
		} else if param.Privacy.ID == s.privacyView.ID {
			param.Catalog = append(param.Catalog, model.Catalog{ID: s.privacyView.ID, Name: s.privacyView.Name})
		} else {
			log.Printf("createAction, illegalPrivacy, id:%d", param.Privacy.ID)
			result.ErrorCode = common_def.IllegalParam
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
