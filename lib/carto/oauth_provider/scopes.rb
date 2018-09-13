module Carto
  module OauthProvider
    module Scopes
      class Scope
        attr_reader :name, :category, :description

        def initialize(name, category, description)
          @name = name
          @category = category
          @description = description
        end

        def add_to_api_key_grants(grants); end
      end

      class Category
        attr_reader :description, :icon

        def initialize(description, icon = nil)
          @description = description
          @icon = icon
        end
      end

      SCOPE_DEFAULT = '_default'.freeze
      SCOPE_OFFLINE = 'offline'.freeze

      CATEGORY_OFFLINE = Category.new('Offline access').freeze
      CATEGORY_USER = Category.new('User and personal data').freeze
      CATEGORY_MONEY = Category.new('Features that may incur in charges', 'money')

      class DataservicesScope < Scope
        def initialize(service, description)
          @service = service
          super("dataservices:#{service}", CATEGORY_MONEY, description)
        end

        def add_to_api_key_grants(grants)
          apis_section = grants.find { |i| i[:type] == 'apis' }
          apis_section[:apis] << 'sql' unless apis_section[:apis].include?('sql')

          ds_section = grants.find { |i| i[:type] == 'dataservices' }
          unless ds_section
            ds_section = { type: 'dataservices', services: [] }
            grants << ds_section
          end

          ds_section[:services] << @service
        end
      end

      SCOPES = [
        Scope.new(SCOPE_DEFAULT, CATEGORY_USER, 'Username and organization name').freeze,
        Scope.new(SCOPE_OFFLINE, CATEGORY_OFFLINE, 'Access CARTO in the background').freeze,

        # Dataservices
        DataservicesScope.new('geocoding', 'Geocoding').freeze,
        DataservicesScope.new('isolines', 'Isochrones').freeze,
        DataservicesScope.new('routing', 'Routing').freeze,
        DataservicesScope.new('observatory', 'Data Observatory').freeze,
      ].freeze

      SCOPES_BY_NAME = SCOPES.map { |s| [s.name, s] }.to_h.freeze

      # The default scope is always granted but cannot be explicitly requested
      SUPPORTED_SCOPES = (SCOPES.map(&:name) - [SCOPE_DEFAULT]).freeze

      def self.invalid_scopes(scopes)
        scopes - SUPPORTED_SCOPES
      end

      class ScopesValidator < ActiveModel::EachValidator
        def validate_each(record, attribute, value)
          return record.errors[attribute] = ['has to be an array'] unless value && value.is_a?(Array)

          invalid_scopes = Scopes.invalid_scopes(value)
          record.errors[attribute] << "contains unsuported scopes: #{invalid_scopes.join(', ')}" if invalid_scopes.any?
        end
      end

      def self.scopes_by_category(new_scopes, previous_scopes)
        # If we had previous scopes, DEFAULT was already granted.
        previous_scopes = previous_scopes.nil? ? [] : previous_scopes + [SCOPE_DEFAULT]

        all_scopes = ([SCOPE_DEFAULT] + new_scopes + previous_scopes).uniq
        scopes_by_category = all_scopes.map { |s| SCOPES_BY_NAME[s] }.group_by(&:category)
        scopes_by_category.map do |category, scopes|
          {
            description: category.description,
            icon: category.icon,
            scopes: scopes.map do |scope|
              {
                description: scope.description,
                new: !previous_scopes.include?(scope.name)
              }
            end
          }
        end
      end
    end
  end
end
