import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {toggleAutoReveal, setCardConfig, setPassword, SIDEBAR_SETTINGS} from '../../actions';
import {CardConfigEditor} from './CardConfigEditor';
import PasswordField from '../common/PasswordField';
import RoomExportFileDownload from './RoomExportFileDownload';

import {StyledSection, StyledExpandButton, StyledArea, StyledTextInput} from './_styled';

const RoomSettings = ({
  t,
  shown,
  autoReveal,
  cardConfig,
  roomId,
  setCardConfig,
  toggleAutoReveal,
  setPassword,
  passwordProtected
}) => {
  const [customCardConfigExpanded, setCustomCardConfigExpanded] = useState(false);
  React.useEffect(() => {
    setCustomCardConfigExpanded(false);
  }, [shown]);

  const [myRoomPassword, setMyRoomPassword] = useState(''); // we never [can] pre-set the pw.
  React.useEffect(() => {
    setMyRoomPassword('');
  }, [passwordProtected]);

  return (
    <StyledArea>
      <h4>{t('room')}</h4>

      <StyledSection>
        <h5>{t('toggleAutoReveal')}</h5>
        {t('autoRevealInfo')}

        <p onClick={toggleAutoReveal} className="clickable" data-testid="toggleAutoReveal">
          <i className={autoReveal ? 'icon-check' : 'icon-check-empty'}></i> {t('autoReveal')}
        </p>
      </StyledSection>

      <StyledSection>
        <h5>{t('passwordProtection')}</h5>
        {t('passwordProtectionInfo')}

        {passwordProtected && (
          <div>
            <p>
              {t('roomIsProtected')} <i className="icon-lock"></i>
            </p>
            <StyledTextInput>
              <PasswordField
                onKeyPress={onRoomPasswordKeyPress}
                onChange={(e) => setMyRoomPassword(e.target.value)}
                value={myRoomPassword}
                placeholder={t('setNewPassword')}
              />

              <button
                data-testid="savePasswordButton"
                className="pure-button pure-button-primary"
                onClick={savePassword}
              >
                <i className="icon-floppy" />
              </button>
            </StyledTextInput>
          </div>
        )}

        {!passwordProtected && (
          <div>
            <p>
              {t('roomIsNotProtected')} <i className="icon-lock-open-alt"></i>
            </p>
            <StyledTextInput>
              <PasswordField
                onKeyPress={onRoomPasswordKeyPress}
                onChange={(e) => setMyRoomPassword(e.target.value)}
                value={myRoomPassword}
                placeholder={t('setNewPassword')}
              />

              <button
                data-testid="savePasswordButton"
                className="pure-button pure-button-primary"
                onClick={savePassword}
              >
                <i className="icon-floppy" />
              </button>
            </StyledTextInput>
          </div>
        )}
      </StyledSection>

      <StyledSection>
        <h5>{t('customCards')}</h5>
        {t('customCardsInfo')}

        {!customCardConfigExpanded && (
          <StyledExpandButton
            type="button"
            className="pure-button pure-button-primary"
            onClick={() => setCustomCardConfigExpanded(true)}
          >
            <i className="icon-angle-double-down"></i>
          </StyledExpandButton>
        )}

        {customCardConfigExpanded && (
          <CardConfigEditor t={t} cardConfig={cardConfig} onSave={(cc) => setCardConfig(cc)} />
        )}
      </StyledSection>

      <StyledSection>
        <h5>{t('export')}</h5>
        {t('exportInfo')}

        <p>
          <RoomExportFileDownload roomId={roomId} />
        </p>
      </StyledSection>
    </StyledArea>
  );

  function onRoomPasswordKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      savePassword();
    }
  }

  function savePassword() {
    setPassword(myRoomPassword);
  }
};

RoomSettings.propTypes = {
  t: PropTypes.func,
  shown: PropTypes.bool,
  autoReveal: PropTypes.bool,
  toggleAutoReveal: PropTypes.func,
  setCardConfig: PropTypes.func,
  setPassword: PropTypes.func,
  cardConfig: PropTypes.array,
  roomId: PropTypes.string,
  passwordProtected: PropTypes.bool
};

export default connect(
  (state) => ({
    t: state.translator,
    shown: state.sidebar === SIDEBAR_SETTINGS,
    autoReveal: state.autoReveal,
    cardConfig: state.cardConfig,
    roomId: state.roomId,
    passwordProtected: state.passwordProtected
  }),
  {
    toggleAutoReveal,
    setCardConfig,
    setPassword
  }
)(RoomSettings);
