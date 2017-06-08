# encoding: utf-8

require 'helpers/metrics_helper'

require_relative '../../../spec_helper'
require_relative 'visualizations_controller_shared_examples'
require_relative '../../../../app/controllers/api/json/visualizations_controller'
require_relative '.././../../factories/organizations_contexts'
require 'factories/carto_visualizations'

describe Api::Json::VisualizationsController do
  include Carto::Factories::Visualizations

  it_behaves_like 'visualization controllers' do
  end

  include Rack::Test::Methods
  include Warden::Test::Helpers
  include CacheHelper
  include MetricsHelper

  before(:all) do
    @user = create_user
  end

  after(:all) do
    bypass_named_maps
    @user.destroy
  end

  # let(:params) { { api_key: @user.api_key } }

  before(:each) do
    bypass_named_maps
    bypass_metrics

    host! "#{@user.username}.localhost.lan"
  end

  after(:each) do
    bypass_named_maps
    delete_user_data @user
  end

  describe '#likes' do

    before(:each) do
      login(@user)
    end

    it "when a map is liked should send an email to the owner" do
      user_owner = create_user
      table = new_table({user_id: user_owner.id, privacy: ::UserTable::PRIVACY_PUBLIC}).save.reload
      # This user is of the same ORM as the table, so TableBlender works
      orm_user = table.table_visualization.user
      orm_user.reload
      vis, rejected_layers = CartoDB::Visualization::DerivedCreator.new(orm_user, [table]).create
      rejected_layers.empty?.should be true
      Resque.expects(:enqueue).with(::Resque::UserJobs::Mail::MapLiked, vis.id, @user.id, kind_of(String)).returns(true)
      post_json api_v1_visualizations_add_like_url({
          id: vis.id
        }) do |response|
        response.status.should be_success
      end
    end

    it "when a map is liked by the owner, the email should not be sent" do
      table = new_table({user_id: @user.id, privacy: ::UserTable::PRIVACY_PUBLIC}).save.reload
      # This user is of the same ORM as the table, so TableBlender works
      orm_user = table.table_visualization.user
      orm_user.reload
      vis, rejected_layers = CartoDB::Visualization::DerivedCreator.new(orm_user, [table]).create
      rejected_layers.empty?.should be true
      Resque.expects(:enqueue).with(::Resque::UserJobs::Mail::MapLiked, vis.id, @user.id, kind_of(String)).never
      post_json api_v1_visualizations_add_like_url({
          id: vis.id
        }) do |response|
        response.status.should be_success
      end
    end

    it "when a dataset is liked should send an email to the owner" do
      user_owner = create_user
      vis = new_table({user_id: user_owner.id, privacy: ::UserTable::PRIVACY_PUBLIC}).save.reload.table_visualization
      Resque.expects(:enqueue).with(::Resque::UserJobs::Mail::TableLiked, vis.id, @user.id, kind_of(String)).returns(true)
      post_json api_v1_visualizations_add_like_url({
          id: vis.id
        }) do |response|
        response.status.should be_success
      end
    end

    it "when a dataset is liked by the owner, the email should not be sent" do
      vis = new_table({user_id: @user.id, privacy: ::UserTable::PRIVACY_PUBLIC}).save.reload.table_visualization
      Resque.expects(:enqueue).with(::Resque::UserJobs::Mail::TableLiked, vis.id, @user.id, kind_of(String)).never
      post_json api_v1_visualizations_add_like_url({
          id: vis.id
        }) do |response|
        response.status.should be_success
      end
    end
  end

  def table_factory(attrs = {})
    new_table(attrs.merge(user_id: @user_1.id)).save.reload
  end
end
