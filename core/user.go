package core

import (
	"encoding/json"
	"log"
	"net/http"

	common_def "muidea.com/magicCommon/common"
	common_result "muidea.com/magicCommon/common"
	"muidea.com/magicCommon/foundation/net"
	"muidea.com/magicCommon/model"
)

func (s *Share) statusAction(res http.ResponseWriter, req *http.Request) {
	log.Print("statusAction")

	type statusResult struct {
		common_result.Result
		OnlineUser model.AccountOnlineView `json:"onlineUser"`
	}

	result := statusResult{}
	for {
		authToken := req.URL.Query().Get(common_def.AuthTokenID)
		sessionID := req.URL.Query().Get(common_def.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("statusAccount failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}

		userView, ok := s.centerAgent.StatusAccount(authToken, sessionID)
		if !ok {
			log.Print("statusAccount failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}

		result.OnlineUser = userView
		result.ErrorCode = common_result.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) loginAction(res http.ResponseWriter, req *http.Request) {
	log.Print("loginAction")

	type loginParam struct {
		Account  string `json:"account"`
		Password string `json:"password"`
	}
	type loginResult struct {
		common_result.Result
		OnlineUser model.AccountOnlineView `json:"onlineUser"`
		AuthToken  string                  `json:"authToken"`
		SessionID  string                  `json:"sessionID"`
	}

	param := &loginParam{}
	result := loginResult{}
	for {
		err := net.ParsePostJSON(req, param)
		if err != nil {
			log.Printf("ParsePostJSON failed, err:%s", err.Error())
			result.ErrorCode = common_result.Failed
			result.Reason = "非法请求"
			break
		}

		userView, authToken, sessionID, ok := s.centerAgent.LoginAccount(param.Account, param.Password)
		if !ok {
			log.Print("login failed, illegal account or password")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效账号或密码"
			break
		}

		result.OnlineUser = userView
		result.AuthToken = authToken
		result.SessionID = sessionID
		result.ErrorCode = common_result.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}

func (s *Share) logoutAction(res http.ResponseWriter, req *http.Request) {
	log.Print("logoutAction")

	type logoutResult struct {
		common_result.Result
	}

	result := logoutResult{}
	for {
		authToken := req.URL.Query().Get(common_def.AuthTokenID)
		sessionID := req.URL.Query().Get(common_def.SessionID)
		if len(authToken) == 0 || len(sessionID) == 0 {
			log.Print("logout failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "无效Token或会话"
			break
		}

		ok := s.centerAgent.LogoutAccount(authToken, sessionID)
		if !ok {
			log.Print("logout failed, illegal authToken or sessionID")
			result.ErrorCode = common_result.Failed
			result.Reason = "非法Token或会话"
			break
		}

		result.ErrorCode = common_result.Success
		break
	}

	block, err := json.Marshal(result)
	if err == nil {
		res.Write(block)
		return
	}

	res.WriteHeader(http.StatusExpectationFailed)
}
